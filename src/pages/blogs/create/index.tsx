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
import { zodResolver } from "@hookform/resolvers/zod";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  imgSrc: z.string().optional(),
});

const CreateBlogPost = ({ userId }: { userId: string }) => {
  const { token } = useAppContext();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      imgSrc: "",
    },
  });

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

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    fetch(`/api/blog/createBlog`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Include authentication token if required
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...values, userId }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to create article");
        }
        alert("Article created successfully!");
      })
      .catch((err) => {
        console.error("Error updating article:", err);
        alert("Error updating article. Please try again.");
      });
  };

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
                Create Article
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

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return { props: { userId: session.user.id } };
};

export default CreateBlogPost;
