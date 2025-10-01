import ArticleComponent from "@/components/Article";
import { Article } from "@/types/article";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";

const BlogsPage = ({ initialBlogs }: { initialBlogs: Article[] }) => {
  const [articles, setArticles] = useState<Article[]>(initialBlogs || []);
  const [offset, setOffset] = useState(10);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { data: session } = useSession();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const loadMoreBlogs = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/blog/getAll?offset=${offset}`);
      const newBlogs: Article[] = await response.json();

      if (newBlogs.length === 0) {
        setHasMore(false);
      } else {
        // Add isEditable property based on current session
        const blogsWithEditability = newBlogs.map((article: Article) => ({
          ...article,
          isEditable: session?.user?.id === article.user.id,
        }));

        setArticles((prev) => [...prev, ...blogsWithEditability]);
        setOffset((prev) => prev + 10);
      }
    } catch (error) {
      console.error("Error loading more blogs:", error);
    } finally {
      setLoading(false);
    }
  }, [offset, loading, hasMore, session?.user?.id]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreBlogs();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMoreBlogs, hasMore, loading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
          Blogs
        </h1>
        <div className="grid gap-8 md:gap-10 lg:gap-12">
          {articles.map((article: Article) => (
            <ArticleComponent key={article.id} {...article} />
          ))}
        </div>

        {/* Loading indicator and intersection observer target */}
        <div ref={loadMoreRef} className="flex justify-center mt-8 py-4">
          {loading && (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-600">Loading more blogs...</span>
            </div>
          )}
          {!hasMore && articles.length > 0 && (
            <p className="text-gray-500 text-center">No more blogs to load</p>
          )}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Get the user session
  const session = await getServerSession(context.req, context.res, authOptions);

  // Fetch initial blogs from your database or API here (first 10)
  const blogs = (
    await fetch("http://localhost:3000/api/blog/getAll?offset=0")
      .then((res) => res.json())
      .catch((err) => {
        console.error("Error fetching blogs:", err);
        return [];
      })
  ).map((article: Article) => {
    return {
      ...article,
      isEditable: session?.user?.id === article.user.id,
    };
  });

  return {
    props: {
      initialBlogs: blogs,
    },
  };
};

export default BlogsPage;
