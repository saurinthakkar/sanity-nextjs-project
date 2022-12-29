import { postBySlugQuery } from "../../lib/queries";
import { previewClient } from "../../lib/sanity.server";

function redirectToPreview(res, Location) {
  res.setPreviewData({});
  res.writeHead(307, { Location });
  res.end();
}

export default async function preview(req, res) {
  const { secret, slug } = req.query;
  //console.log("HUI", secret, process.env.SANITY_PREVIEW_SECRET);
  if (!secret) {
    return res.status(401).json({ message: "No secret token" });
  }

  if (secret !== process.env.SANITY_PREVIEW_SECRET) {
    return res.status(401).json({ message: "Invalid secret" });
  }

  if (!slug) {
    return redirectToPreview(res, "/");
  }

  const post = await previewClient.fetch(postBySlugQuery, { slug });

  console.log("LOP", post, post.slug);

  if (!post) {
    return res.status(401).json({ message: "Invalid slug" });
  }

  return redirectToPreview(res, `/post/${post.slug}`);
}
