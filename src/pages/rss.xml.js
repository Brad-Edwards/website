import rss from "@astrojs/rss";
import { getPublishedPosts } from "../lib/content";

export async function GET(context) {
  const posts = await getPublishedPosts();

  return rss({
    title: "Brad Edwards",
    description: "Applied security research - agentic systems, cyber ranges, SOC tooling.",
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description ?? "",
      pubDate: post.data.date,
      link: `/posts/${post.id}/`,
      categories: post.data.tags,
    })),
  });
}
