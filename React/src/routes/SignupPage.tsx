import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/feedback";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import useAuth from "../hooks/useAuth";
import { ApiError } from "../lib/httpClient";

// Mirrors the backend's signupSchema (auth/authSchemas.ts)
const signupFormSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  username: z
    .string()
    .trim()
    .min(3, "At least 3 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Letters, numbers and underscore only"),
  email: z.email("Enter a valid email address"),
  password: z.string().min(8, "At least 8 characters"),
});

type SignupFormValues = z.infer<typeof signupFormSchema>;

function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: { firstName: "", lastName: "", username: "", email: "", password: "" },
  });

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0] ?? null;
    setAvatarFile(file);
    setAvatarPreview(file ? URL.createObjectURL(file) : null);
  }

  async function onSubmit(values: SignupFormValues): Promise<void> {
    try {
      await signup({ ...values, avatar: avatarFile ?? undefined });
      toast.success("Account created — you can log in now");
      navigate("/login");
    } catch (err) {
      form.setError("root", {
        message: err instanceof ApiError ? err.message : "Failed to create account",
      });
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="size-5" />
          </div>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Sign up to manage students, teachers and courses.</CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center gap-2">
                <Avatar size="lg">
                  {avatarPreview && <AvatarImage src={avatarPreview} alt="Avatar preview" />}
                  <AvatarFallback>
                    <GraduationCap className="size-4" />
                  </AvatarFallback>
                </Avatar>
                <label className="cursor-pointer text-sm text-muted-foreground underline">
                  {avatarFile ? "Change photo" : "Add a profile photo (optional)"}
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input autoFocus {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. samin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.formState.errors.root && (
                <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
              )}

              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Creating account..." : "Sign up"}
              </Button>
            </CardContent>
          </form>
        </Form>

        <CardFooter className="justify-center text-sm text-muted-foreground">
          Already have an account?&nbsp;<Link to="/login" className="underline">Log in</Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default SignupPage;
