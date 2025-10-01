import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { useRouter } from "next/router";

const formSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().optional(),
    firstName: z
      .string()
      .refine((val) => val === "" || val.length >= 2, {
        message: "First name must be at least 2 characters",
      })
      .optional(),
    lastName: z
      .string()
      .refine((val) => val === "" || val.length >= 2, {
        message: "Last name must be at least 2 characters",
      })
      .optional(),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword && confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

const DynamicForm = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const endpoint = isRegistering ? "/api/auth/register" : "/api/auth/login";
    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.id) {
          window.alert(data.message || "An error occurred");
        } else {
          localStorage.setItem("token", data.token);
          router.push("/blogs");
        }
      })
      .catch((err) => {
        form.setError("root", { message: err.message });
      });
  }

  const inputsTypes = [
    {
      name: "email",
      type: "email",
      label: "Email",
      placeholder: "example@host.com",
    },
    {
      name: "password",
      type: "password",
      label: "Password",
      placeholder: "••••••",
    },
    {
      name: "confirmPassword",
      type: "password",
      label: "Confirm Password",
      onRegistration: true,
      placeholder: "••••••",
    },
    {
      name: "firstName",
      type: "text",
      label: "First Name",
      onRegistration: true,
      placeholder: "John",
    },
    {
      name: "lastName",
      type: "text",
      label: "Last Name",
      placeholder: "Doe",
      onRegistration: true,
    },
  ];

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {inputsTypes
            .filter((input) => (isRegistering ? true : !input.onRegistration))
            .map((input) => {
              return (
                <FormField
                  key={input.name}
                  control={form.control}
                  name={
                    input.name as
                      | "email"
                      | "password"
                      | "confirmPassword"
                      | "firstName"
                      | "lastName"
                  }
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{input.label}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={input.placeholder}
                          type={input.type}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            })}
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
      <Button variant="link" onClick={() => setIsRegistering((prev) => !prev)}>
        {isRegistering ? "Login" : "Register"}
      </Button>
    </div>
  );
};

export default DynamicForm;
