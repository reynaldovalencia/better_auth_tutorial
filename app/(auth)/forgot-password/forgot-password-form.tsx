"use client";

import { LoadingButton } from "@/components/loading-button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Ensure you have the shadcn Label component
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.email({ message: "Please enter a valid email" }),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit({ email }: ForgotPasswordValues) {
    setSuccess(null);
    setError(null);

    //Si olvido password
    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: "/reset-password",
    });

    if (error) {
      setError(error.message || "Something went wrong. Please try again.");
    } else {
      setSuccess(
        "If an account with that email exists, a reset link has been sent.",
      );
      //reset form
      reset();
    }
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm font-medium text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          {success && (
            <div role="status" className="text-sm text-green-600">
              {success}
            </div>
          )}
          {error && (
            <div role="alert" className="text-sm text-red-600">
              {error}
            </div>
          )}

          <LoadingButton
            type="submit"
            className="w-full"
            loading={isSubmitting}
          >
            Send reset link
          </LoadingButton>
        </form>
      </CardContent>
    </Card>
  );
}
