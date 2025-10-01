import { Blog } from "@/generated/prisma";

interface Article extends Blog {
  user: User;
  isEditable?: boolean;
}
