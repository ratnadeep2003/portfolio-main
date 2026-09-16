import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type PostSummary = {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  image?: string;
  publishedAt?: string;
  updatedAt?: string;
  tags: string[];
  readingTime: string;
  draft: boolean;
  coAuthors?: string[];
  views?: number;
};

export type PostDetail = PostSummary & {
  content: string;
};

const contentDirectory = path.join(process.cwd(), "content");

function calculateReadingTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}

export async function getPosts(limit?: number): Promise<PostSummary[]> {
  try {
    if (!fs.existsSync(contentDirectory)) {
      return [];
    }

    const files = fs.readdirSync(contentDirectory);
    const mdxFiles = files.filter(
      (file) => file.endsWith(".mdx") || file.endsWith(".md")
    );

    const posts: PostSummary[] = mdxFiles
      .map((fileName) => {
        const slug = fileName.replace(/\.(mdx|md)$/, "");
        const filePath = path.join(contentDirectory, fileName);
        const fileContent = fs.readFileSync(filePath, "utf8");
        const { data, content } = matter(fileContent);

        return {
          id: slug,
          slug,
          title: data.title || slug,
          summary: data.summary || "",
          image: data.image || undefined,
          publishedAt: data.publishedAt || "",
          updatedAt: data.updatedAt || data.publishedAt || "",
          tags: Array.isArray(data.tags) ? data.tags : [],
          readingTime: data.readingTime || calculateReadingTime(content),
          draft: Boolean(data.draft),
          coAuthors: data.coAuthors || [],
          views: 1,
        };
      })
      .sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.publishedAt || 0).getTime();
        const dateB = new Date(b.updatedAt || b.publishedAt || 0).getTime();
        return dateB - dateA;
      });

    if (limit) {
      return posts.slice(0, limit);
    }
    return posts;
  } catch (error) {
    console.error("[getPosts error]", error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  try {
    if (!fs.existsSync(contentDirectory)) {
      return null;
    }

    let filePath = path.join(contentDirectory, `${slug}.mdx`);
    if (!fs.existsSync(filePath)) {
      filePath = path.join(contentDirectory, `${slug}.md`);
    }

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContent);

    return {
      id: slug,
      slug,
      title: data.title || slug,
      summary: data.summary || "",
      image: data.image || undefined,
      publishedAt: data.publishedAt || "",
      updatedAt: data.updatedAt || data.publishedAt || "",
      tags: Array.isArray(data.tags) ? data.tags : [],
      readingTime: data.readingTime || calculateReadingTime(content),
      draft: Boolean(data.draft),
      coAuthors: data.coAuthors || [],
      views: 1,
      content,
    };
  } catch (error) {
    console.error(`[getPostBySlug error: ${slug}]`, error);
    return null;
  }
}