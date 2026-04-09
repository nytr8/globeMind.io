import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  FiCheck,
  FiEdit2,
  FiFolder,
  FiFolderPlus,
  FiPlus,
  FiTrash,
  FiX,
} from "react-icons/fi";
import toast from "react-hot-toast";
import DashboardCard from "../../items/components/DashboardCard";
import useItem from "../../items/hook/useItem";
import useCollection from "../hook/useCollection";

const defaultCollectionForm = {
  name: "",
  type: "general",
  description: "",
};

const Collections = () => {
  const { collections, selectedCollection, collectionItems, loading } =
    useSelector((state) => state.collections);
  const allItems = useSelector((state) => state.items.items);

  const {
    handleFetchCollections,
    handleFetchCollectionById,
    handleCreateCollection,
    handleUpdateCollection,
    handleDeleteCollection,
    handleAddItemToCollection,
    handleRemoveItemFromCollection,
  } = useCollection();
  const { handleFetchAllItems, handleDeleteItem } = useItem();

  const [selectedCollectionId, setSelectedCollectionId] = useState("");
  const [createForm, setCreateForm] = useState(defaultCollectionForm);
  const [editForm, setEditForm] = useState(defaultCollectionForm);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState("");

  useEffect(() => {
    const initialize = async () => {
      const fetchedCollections = await handleFetchCollections();
      await handleFetchAllItems();

      if (fetchedCollections.length > 0) {
        setSelectedCollectionId(fetchedCollections[0]._id);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    if (!collections.length) {
      setSelectedCollectionId("");
      return;
    }

    const selectedExists = collections.some(
      (collection) => collection._id === selectedCollectionId,
    );

    if (!selectedCollectionId || !selectedExists) {
      setSelectedCollectionId(collections[0]._id);
    }
  }, [collections, selectedCollectionId]);

  useEffect(() => {
    if (!selectedCollectionId) return;

    const fetchCollectionDetails = async () => {
      const data = await handleFetchCollectionById(selectedCollectionId);
      if (!data?.collection) return;

      setEditForm({
        name: data.collection.name || "",
        type: data.collection.type || "general",
        description: data.collection.description || "",
      });
    };

    fetchCollectionDetails();
  }, [selectedCollectionId]);

  const collectionNameById = useMemo(() => {
    return collections.reduce((acc, collection) => {
      acc[collection._id] = collection.name;
      return acc;
    }, {});
  }, [collections]);

  const assignableItems = useMemo(() => {
    if (!selectedCollectionId) return [];

    return allItems.filter(
      (item) => String(item.collectionId || "") !== selectedCollectionId,
    );
  }, [allItems, selectedCollectionId]);

  const refreshCollectionScreen = async (
    targetCollectionId = selectedCollectionId,
  ) => {
    await Promise.all([handleFetchCollections(), handleFetchAllItems()]);
    if (targetCollectionId) {
      await handleFetchCollectionById(targetCollectionId);
    }
  };

  const onCreateCollection = async (event) => {
    event.preventDefault();

    if (!createForm.name.trim()) {
      toast.error("Collection name is required");
      return;
    }

    try {
      const created = await handleCreateCollection(createForm);
      toast.success("Collection created");
      setCreateForm(defaultCollectionForm);
      setShowCreateForm(false);
      await refreshCollectionScreen(created?._id);
      if (created?._id) {
        setSelectedCollectionId(created._id);
      }
    } catch {
      toast.error("Failed to create collection");
    }
  };

  const onUpdateCollection = async (event) => {
    event.preventDefault();
    if (!selectedCollectionId) return;

    if (!editForm.name.trim()) {
      toast.error("Collection name is required");
      return;
    }

    try {
      await handleUpdateCollection(selectedCollectionId, editForm);
      toast.success("Collection updated");
      await refreshCollectionScreen(selectedCollectionId);
    } catch {
      toast.error("Failed to update collection");
    }
  };

  const onDeleteCollection = async (collectionId) => {
    const shouldDelete = window.confirm(
      "Delete this collection? Items will stay saved and become unassigned.",
    );
    if (!shouldDelete) return;

    try {
      await handleDeleteCollection(collectionId);
      toast.success("Collection deleted");
      await refreshCollectionScreen();
    } catch {
      toast.error("Failed to delete collection");
    }
  };

  const onAddItem = async () => {
    if (!selectedCollectionId || !selectedItemId) {
      toast.error("Choose an item first");
      return;
    }

    try {
      await handleAddItemToCollection(selectedCollectionId, selectedItemId);
      toast.success("Item added to collection");
      setSelectedItemId("");
      await refreshCollectionScreen(selectedCollectionId);
    } catch {
      toast.error("Failed to add item");
    }
  };

  const onRemoveItem = async (itemId) => {
    if (!selectedCollectionId) return;

    try {
      await handleRemoveItemFromCollection(selectedCollectionId, itemId);
      toast.success("Item removed from collection");
      await refreshCollectionScreen(selectedCollectionId);
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const onDeleteItem = async (itemId) => {
    await handleDeleteItem(itemId);
    await refreshCollectionScreen(selectedCollectionId);
  };

  return (
    <div className="max-w-8xl mx-auto pb-12 animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.6)]"></div>
          <h1 className="text-2xl font-bold text-white">Collections</h1>
        </div>
        <button
          type="button"
          onClick={() => setShowCreateForm((previous) => !previous)}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors"
        >
          {showCreateForm ? <FiX size={16} /> : <FiFolderPlus size={16} />}
          {showCreateForm ? "Close" : "New Collection"}
        </button>
      </div>

      {showCreateForm && (
        <form
          onSubmit={onCreateCollection}
          className="mb-6 bg-[#121826] border border-slate-800/80 rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 gap-3"
        >
          <input
            value={createForm.name}
            onChange={(event) =>
              setCreateForm((previous) => ({
                ...previous,
                name: event.target.value,
              }))
            }
            placeholder="Collection name"
            className="bg-[#151B2B] text-slate-200 rounded-lg px-3 py-2 border border-slate-700/70 focus:outline-none focus:ring-1 focus:ring-blue-500/60"
          />
          <input
            value={createForm.type}
            onChange={(event) =>
              setCreateForm((previous) => ({
                ...previous,
                type: event.target.value,
              }))
            }
            placeholder="Collection type (example: Study)"
            className="bg-[#151B2B] text-slate-200 rounded-lg px-3 py-2 border border-slate-700/70 focus:outline-none focus:ring-1 focus:ring-blue-500/60"
          />
          <input
            value={createForm.description}
            onChange={(event) =>
              setCreateForm((previous) => ({
                ...previous,
                description: event.target.value,
              }))
            }
            placeholder="Description (optional)"
            className="bg-[#151B2B] text-slate-200 rounded-lg px-3 py-2 border border-slate-700/70 focus:outline-none focus:ring-1 focus:ring-blue-500/60"
          />
          <button
            type="submit"
            className="md:col-span-3 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FiCheck size={15} />
            Create Collection
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-4 space-y-3">
          {collections.length === 0 ? (
            <div className="bg-[#121826] border border-slate-800/80 rounded-xl p-4 text-slate-400">
              No collections yet. Create your first collection to organize saved
              items.
            </div>
          ) : (
            collections.map((collection) => {
              const isActive = collection._id === selectedCollectionId;

              return (
                <div
                  key={collection._id}
                  onClick={() => setSelectedCollectionId(collection._id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedCollectionId(collection._id);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  className={`w-full text-left bg-[#121826] border rounded-xl p-4 transition-colors ${
                    isActive
                      ? "border-blue-500/60"
                      : "border-slate-800/80 hover:border-slate-600/60"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-white font-semibold truncate">
                        {collection.name}
                      </p>
                      <p className="text-xs text-blue-300 uppercase tracking-wider mt-1">
                        {collection.type || "general"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-300 bg-slate-700/60 px-2 py-1 rounded-full">
                        {collection.itemCount || 0}
                      </span>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedCollectionId(collection._id);
                        }}
                        className="text-slate-400 hover:text-blue-300 transition-colors"
                        title="Edit collection"
                      >
                        <FiEdit2 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onDeleteCollection(collection._id);
                        }}
                        className="text-slate-400 hover:text-red-300 transition-colors"
                        title="Delete collection"
                      >
                        <FiTrash size={14} />
                      </button>
                    </div>
                  </div>
                  {collection.description && (
                    <p className="text-sm text-slate-400 mt-2 line-clamp-2">
                      {collection.description}
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="xl:col-span-8 bg-[#121826] border border-slate-800/80 rounded-2xl p-6">
          {!selectedCollection ? (
            <div className="text-slate-400 text-center py-16">
              Select a collection to view and manage items.
            </div>
          ) : (
            <div className="space-y-8">
              <div className="border-b border-slate-800/80 pb-6">
                <h2 className="text-xl font-bold text-white mb-4">
                  Edit Collection
                </h2>
                <form
                  onSubmit={onUpdateCollection}
                  className="grid grid-cols-1 md:grid-cols-3 gap-3"
                >
                  <input
                    value={editForm.name}
                    onChange={(event) =>
                      setEditForm((previous) => ({
                        ...previous,
                        name: event.target.value,
                      }))
                    }
                    placeholder="Collection name"
                    className="bg-[#151B2B] text-slate-200 rounded-lg px-3 py-2 border border-slate-700/70 focus:outline-none focus:ring-1 focus:ring-blue-500/60"
                  />
                  <input
                    value={editForm.type}
                    onChange={(event) =>
                      setEditForm((previous) => ({
                        ...previous,
                        type: event.target.value,
                      }))
                    }
                    placeholder="Collection type"
                    className="bg-[#151B2B] text-slate-200 rounded-lg px-3 py-2 border border-slate-700/70 focus:outline-none focus:ring-1 focus:ring-blue-500/60"
                  />
                  <input
                    value={editForm.description}
                    onChange={(event) =>
                      setEditForm((previous) => ({
                        ...previous,
                        description: event.target.value,
                      }))
                    }
                    placeholder="Description"
                    className="bg-[#151B2B] text-slate-200 rounded-lg px-3 py-2 border border-slate-700/70 focus:outline-none focus:ring-1 focus:ring-blue-500/60"
                  />
                  <button
                    type="submit"
                    className="md:col-span-3 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <FiCheck size={15} />
                    Save Changes
                  </button>
                </form>
              </div>

              <div className="border-b border-slate-800/80 pb-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Add Item To Collection
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] gap-3 items-center">
                  <select
                    value={selectedItemId}
                    onChange={(event) => setSelectedItemId(event.target.value)}
                    className="w-full min-w-0 bg-[#151B2B] text-slate-200 rounded-lg px-3 py-2 border border-slate-700/70 focus:outline-none focus:ring-1 focus:ring-blue-500/60"
                  >
                    <option value="">Choose item</option>
                    {assignableItems.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.title}
                        {item.collectionId
                          ? ` (currently in ${collectionNameById[item.collectionId] || "another collection"})`
                          : ""}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={onAddItem}
                    className="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <FiPlus size={15} />
                    Add
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <FiFolder className="text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">
                    Items In This Collection
                  </h3>
                  <span className="text-xs text-slate-300 bg-slate-700/60 px-2 py-1 rounded-full">
                    {collectionItems.length}
                  </span>
                </div>

                {loading ? (
                  <p className="text-slate-400">Loading collection...</p>
                ) : collectionItems.length === 0 ? (
                  <p className="text-slate-400">
                    This collection has no items yet.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {collectionItems.map((item) => (
                      <div key={item._id} className="space-y-2">
                        <DashboardCard {...item} onDelete={onDeleteItem} />
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item._id)}
                          className="w-full text-sm text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 rounded-lg py-2 transition-colors"
                        >
                          Remove From Collection
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collections;
