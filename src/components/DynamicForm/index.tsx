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
import { signIn } from "next-auth/react";

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isRegistering) {
      // Handle registration with direct API call
      const endpoint = "/api/auth/register";
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (!data.id) {
          window.alert(data.message || "Registration failed");
        } else {
          // After successful registration, sign them in
          const result = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
          });

          if (result?.error) {
            window.alert("Registration successful but login failed");
          } else {
            router.push("/");
          }
        }
      } catch (err) {
        console.error("Registration error:", err);
        form.setError("root", { message: "Registration failed" });
      }
    } else {
      // Handle login with NextAuth
      try {
        const result = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });

        if (result?.error) {
          window.alert("Invalid email or password");
        } else {
          router.push("/");
        }
      } catch (err) {
        console.error("Login error:", err);
        form.setError("root", { message: "Login failed" });
      }
    }
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
