import ArticleComponent from "@/components/Article";
import { Article } from "@/types/article";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const BlogsPage = ({ blogs }: { blogs: Article[] }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
          Blogs
        </h1>
        <div className="grid gap-8 md:gap-10 lg:gap-12">
          {blogs.map((article: Article) => (
            <ArticleComponent key={article.id} {...article} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Get the user session
  const session = await getServerSession(context.req, context.res, authOptions);

  // Fetch blogs from your database or API here
  const blogs = (
    await fetch("http://localhost:3000/api/blog/getAll")
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
      blogs,
    },
  };
};

export default BlogsPage;
