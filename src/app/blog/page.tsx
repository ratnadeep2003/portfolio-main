import PostsSkeleton from "@/components/PostsSkeleton";
import PostsWithSearch from "@/components/PostsWithSearch";
import { getPosts } from "@/lib/notion"; 
import { Suspense } from "react";

export const revalidate = 600;

async function BlogPosts() {
  const posts = await getPosts();
  return <PostsWithSearch posts={posts} />;
}

export default function BlogPage() {
  return (
    <article className="mt-8 flex flex-col gap-8 pb-16">
      <div className="flex items-center justify-between">
        <h1 className="title">my blog.</h1>
        <a
          href="https://zigzag-cabin-0e0.notion.site/Personal-Blog-Home-3e42520adef6802fa816de4b121f1171"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-muted-foreground underline hover:text-foreground"
        >
          View full blog on Notion →
        </a>
      </div>

      <Suspense fallback={<PostsSkeleton rows={6} showControls />}>
        <BlogPosts />
      </Suspense>
    </article>
  );
}