import { Blog, User } from "@/generated/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ArticleProps extends Blog {
  isEditable?: boolean;
  user: User;
}

const Article = ({
  id,
  title,
  description,
  imgSrc,
  updatedAt,
  user,
  isEditable,
}: ArticleProps) => {
  const deleteArticle = async () => {
    // Implement delete functionality here
    try {
      const result = await fetch(`/api/blog/deleteBlog?id=${id}`, {
        method: "DELETE",
      });

      if (!result.ok) {
        console.error("Failed to delete article:", result.statusText);
        return;
      }

      window.location.reload();
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  };
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && (
          <CardDescription className="line-clamp-4 overflow-hidden text-ellipsis">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <img
          src={imgSrc || "/90246627-ecbda400-de2c-11ea-8bfb-b4307bfb975d.png"}
          alt={title}
          className="w-full h-48 object-contain rounded-md"
          onError={(e) => {
            e.currentTarget.src =
              "/90246627-ecbda400-de2c-11ea-8bfb-b4307bfb975d.png";
          }}
        />
        <div className="mt-4 text-sm text-muted-foreground">
          By {user.firstName} {user.lastName} •{" "}
          {new Date(updatedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      </CardContent>
      {isEditable && (
        <CardFooter>
          <Link href={`/blogs/edit/${id}`}>
            <Button variant="outline" size="sm">
              Edit Article
            </Button>
          </Link>
          <Button
            className="ml-2 bg-red-500 border-red-500 text-white hover:bg-red-600 hover:border-red-600"
            size="sm"
            variant="outline"
            onClick={deleteArticle}
          >
            Delete Article
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default Article;
