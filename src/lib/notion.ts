import { NotionAPI } from "notion-client";

const notion = new NotionAPI();

const ROOT_PAGE_ID = "3e42520adef6802fa816de4b121f1171";

export async function getNotionRecordMap(pageId: string) {
  return notion.getPage(pageId);
}

function extractTitle(b: any): string {
  try {
    const titleProp = b?.properties?.title;
    if (Array.isArray(titleProp)) {
      return titleProp.map((t: any) => t[0]).join("");
    }
    return "Untitled";
  } catch {
    return "Untitled";
  }
}
const EXCLUDED_TITLES = ["contact me", "about me"];

export async function getPosts(limit?: number) {
  const recordMap = await getNotionRecordMap(ROOT_PAGE_ID);
  const { block } = recordMap;

  const posts = Object.keys(block)
    .filter((id) => {
      const b = (block[id] as any)?.value?.value;
      return b?.type === "page" && id.replace(/-/g, "") !== ROOT_PAGE_ID;
    })
    .map((id) => {
      const b = (block[id] as any).value.value;
      return {
        id,
        slug: id.replace(/-/g, ""),
        title: extractTitle(b),
        summary: "",
        image: undefined,
        tags: [] as string[],
        readingTime: "",
        draft: false,
        coAuthors: [] as string[],
        publishedAt: b?.created_time
          ? new Date(b.created_time).toISOString()
          : "",
        updatedAt: b?.last_edited_time
          ? new Date(b.last_edited_time).toISOString()
          : "",
      };
    })
    .filter((post) => !EXCLUDED_TITLES.includes(post.title.trim().toLowerCase()));

  return limit ? posts.slice(0, limit) : posts;
}

export async function getPostBySlug(slug: string) {
  const posts = await getPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) return null;

  const recordMap = await getNotionRecordMap(post.id);
  return { ...post, recordMap };
}

