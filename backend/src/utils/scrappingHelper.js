import axios from "axios";

// detect type of item
export const detectType = (url, result) => {
  const lowerUrl = url.toLowerCase();
  const rawType = result?.ogType || "";

  // 1. Twitter / X
  if (
    lowerUrl.includes("twitter.com") ||
    lowerUrl.includes("://x.com/") ||
    lowerUrl.includes(".x.com/")
  ) {
    return "tweet";
  }

  // 2. LinkedIn
  if (lowerUrl.includes("linkedin.com")) {
    return "linkedin";
  }

  // 4. YouTube / video files
  if (
    lowerUrl.includes("youtube.com") ||
    lowerUrl.includes("youtu.be") ||
    /\.(mp4|webm|ogg)(\?.*)?$/.test(lowerUrl)
  ) {
    return "video";
  }
  // 6. Images / Pinterest
  if (lowerUrl.includes("pinterest.com") || lowerUrl.includes("pin.it")) {
    return "image";
  }

  if (/\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/.test(lowerUrl)) {
    return "image";
  }

  // 7. PDF
  if (/\.pdf(\?.*)?$/.test(lowerUrl)) {
    return "document";
  }

  // 8. GitHub
  if (lowerUrl.includes("github.com")) {
    return "github";
  }

  // 9. Instagram
  if (lowerUrl.includes("instagram.com")) {
    return "instagram";
  }

  // 10. Reddit
  if (lowerUrl.includes("reddit.com")) {
    return "reddit";
  }

  // 11. Spotify
  if (lowerUrl.includes("spotify.com")) {
    return "audio";
  }

  // 13. Medium / Substack (article platforms)
  if (lowerUrl.includes("medium.com") || lowerUrl.includes("substack.com")) {
    return "article";
  }

  // 14. OG type fallback
  const cleanType = rawType.split(".")[0];

  if (cleanType === "video") return "video";
  if (cleanType === "article") return "article";
  if (cleanType === "music") return "audio";
  if (cleanType === "website") return "website";

  // 15. Default
  return "link";
};
// redit scrapper
export const fetchRedditData = async (url) => {
  try {
    // Only handle direct post URLs
    if (!url.includes("/comments/")) {
      return {
        title: "Reddit",
        contentText: "View on Reddit",
        thumbnail: "https://placehold.co/600x400/FF4500/ffffff?text=Reddit",
        type: "reddit",
      };
    }

    const cleanUrl = url.split("?")[0].replace(/\/$/, "");
    const jsonUrl = `${cleanUrl}.json`;

    const { data } = await axios.get(jsonUrl, {
      timeout: 5000,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; MyApp/1.0)",
      },
    });

    const post = data?.[0]?.data?.children?.[0]?.data;
    if (!post) throw new Error("No post data");

    const title = post.title || "Reddit Post";
    const contentText = post.selftext?.trim() || "View on Reddit";
    const subreddit = post.subreddit_name_prefixed || "r/reddit";

    let thumbnail = null;

    // ✅ 1. Best: use the actual linked image (imgur, i.redd.it direct links)
    const destUrl = post.url_overridden_by_dest || "";
    if (/\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(destUrl)) {
      thumbnail = destUrl;
    }

    // ✅ 2. Try media_metadata (gallery posts)
    if (!thumbnail && post.media_metadata) {
      const firstMedia = Object.values(post.media_metadata)[0];
      const src = firstMedia?.s?.u || firstMedia?.s?.gif;
      if (src) {
        thumbnail = src.replace(/&amp;/g, "&");
      }
    }

    // ✅ 3. Try external_preview (less CDN-restricted than preview)
    if (!thumbnail && post.preview?.images?.[0]?.variants?.gif?.source?.url) {
      thumbnail = post.preview.images[0].variants.gif.source.url.replace(
        /&amp;/g,
        "&",
      );
    }

    // ✅ 4. Thumbnail from post (only if it's a real URL, not "self"/"default"/"nsfw")
    if (!thumbnail && post.thumbnail && post.thumbnail.startsWith("http")) {
      thumbnail = post.thumbnail;
    }

    // ✅ 5. Placeholder with subreddit name
    if (!thumbnail) {
      thumbnail = `https://placehold.co/600x400/FF4500/ffffff?text=${encodeURIComponent(subreddit)}`;
    }

    return { title, contentText, thumbnail, type: "reddit" };
  } catch (err) {
    console.log("Reddit fetch failed:", err.message);
    return {
      title: "Reddit Post",
      contentText: "View on Reddit",
      thumbnail: "https://placehold.co/600x400/FF4500/ffffff?text=Reddit",
      type: "reddit",
    };
  }
};

// twitter scrapping
export const twitterScrapper = async (url) => {
  try {
    const response = await fetch(
      `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}`,
    );
    const data = await response.json();

    embedHtml = data.html;
    title = data.author_name
      ? `${data.author_name} on Twitter`
      : "Twitter Post";
    contentText =
      data.html?.replace(/<[^>]+>/g, "").trim() || "View on Twitter";
  } catch {
    title = "Twitter Post";
    contentText = "View on Twitter";
  }
};

// linkedin scrapper
export const linkedinScrapper = async () => {
  const pathParts = parsedUrl.pathname.split("/").filter(Boolean);
  const rawSlug = pathParts[1] || "LinkedIn User";
  const cleanSlug = rawSlug.replace(/-\d+$/, "");
  const displayName = cleanSlug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  // Differentiate LinkedIn content types
  if (parsedUrl.pathname.includes("/posts/")) {
    type = "linkedin-post";
    title = `${displayName}'s LinkedIn Post`;
  } else if (parsedUrl.pathname.includes("/in/")) {
    type = "linkedin-profile";
    title = `${displayName} — LinkedIn Profile`;
  } else if (parsedUrl.pathname.includes("/company/")) {
    type = "linkedin-company";
    title = `${displayName} — LinkedIn Company`;
  } else {
    type = "linkedin";
    title = `${displayName}'s LinkedIn`;
  }
};
