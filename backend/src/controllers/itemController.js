import itemModel from "../models/item.model.js";
import ogs from "open-graph-scraper";

export const createItem = async (req, res) => {
  const { id } = req.user;
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({
      message: "url required",
    });
  }
  const options = {
    url: url,
  };
  let type = null;
  let contentText = null;
  let title = null;
  let thumbnail = null;

  ogs(options).then((data) => {
    const { error, html, result, response } = data;
    console.log("result:", result);

    thumbnail = result.ogImage[0].url;

    title = result.ogTitle;

    contentText = result.ogDescription;

    type = result.ogType;
  });
  const item = await itemModel.create({
    userId: id,
    type,
    contentText,
    title,
    thumbnail,
    url,
  });
  res.status(201).json({
    message: "item added succesfully",
    item,
  });
};
