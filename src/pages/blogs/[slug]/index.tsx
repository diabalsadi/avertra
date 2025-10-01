import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAppContext } from "@/context/AppContext";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Article } from "@/types/article";
import { zodResolver } from "@hookform/resolvers/zod";
import { getServerSession } from "next-auth";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface ArticlePageProps extends Article {
  slug: string;
}
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  imgSrc: z.string().optional(),
});

const ArticlePage = ({
  slug,
  title,
  description,
  imgSrc,
  isEditable,
}: ArticlePageProps) => {
  console.log("isEditable:", isEditable);
  const { token } = useAppContext();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: title,
      description: description || "",
      imgSrc: imgSrc || "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    fetch(`/api/blog/updateBlog?id=${slug}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // Include authentication token if required
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to update article");
        }
        alert("Article updated successfully!");
      })
      .catch((err) => {
        console.error("Error updating article:", err);
        alert("Error updating article. Please try again.");
      });
  };

  const inputsTypes = [
    {
      name: "title",
      label: "Title",
      placeholder: "Enter the title of the blog",
      type: "text",
    },
    {
      name: "description",
      label: "Description",
      placeholder: "Enter a brief description",
      type: "text",
      component: "textarea",
    },
    {
      name: "imgSrc",
      label: "Image URL",
      placeholder: "Enter the image URL",
      type: "text",
    },
  ];

  if (!isEditable) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Article Container */}
          <article className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Article Header */}
            <div className="px-8 pt-8 pb-6">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {title}
              </h1>
              {description && (
                <p className="text-xl text-gray-600 leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            {/* Article Image */}
            {imgSrc && (
              <div className="px-8 pb-6">
                <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={imgSrc}
                    alt={title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "/90246627-ecbda400-de2c-11ea-8bfb-b4307bfb975d.png";
                    }}
                  />
                </div>
              </div>
            )}

            {/* Article Content */}
            <div className="px-8 pb-8">
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {description ||
                    "This article doesn't have additional content yet."}
                </p>
              </div>
            </div>

            {/* Article Footer */}
            <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Published on
                  <time className="font-medium">
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.history.back()}
                  className="hover:bg-blue-50 hover:border-blue-300"
                >
                  ← Back to Articles
                </Button>
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Edit Article
          </h1>
          <p className="text-gray-600">Make changes to your article below</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 backdrop-blur-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {inputsTypes.map((input) => {
                return (
                  <FormField
                    key={input.name}
                    control={form.control}
                    name={input.name as "title" | "description" | "imgSrc"}
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-semibold text-gray-700">
                          {input.label}
                        </FormLabel>
                        <FormControl>
                          {input.component === "textarea" ? (
                            <Textarea
                              placeholder={input.placeholder}
                              className="min-h-[120px] border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all duration-200 resize-vertical"
                              {...field}
                            />
                          ) : (
                            <Input
                              placeholder={input.placeholder}
                              type={input.type}
                              className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all duration-200"
                              {...field}
                            />
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              })}
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                Update Article
              </Button>
            </form>
          </Form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Need help? Contact our support team
          </p>
        </div>
      </div>
    </div>
  );
};

import type { GetServerSidePropsContext } from "next";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { slug } = context.params as { slug: string };
  // check if the user is authenticated
  const session = await getServerSession(context.req, context.res, authOptions);

  const article = await fetch(
    `http://localhost:3000/api/blog/getArticle?id=${slug}`
  ).then((res) => res.json());

  return { props: { slug, ...article, isEditable: !!session } };
};

export default ArticlePage;
