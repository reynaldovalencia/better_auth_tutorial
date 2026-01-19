"use client";

import { LoadingButton } from "@/components/loading-button";
import { PasswordInput } from "@/components/password-input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { passwordSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";

const resetPasswordSchema = z.object({
  newPassword: passwordSchema,
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "" },
  });

  async function onSubmit({ newPassword }: ResetPasswordValues) {
    setSuccess(null);
    setError(null);

    const { error } = await authClient.resetPassword({
      newPassword,
      token,
    });

    if (error) {
      setError(error.message || "Something went wrong. Please try again.");
    } else {
      setSuccess(
        "Your password has been reset successfully. You can now sign in.",
      );
      setTimeout(() => {
        router.push("/sign-in");
      }, 3000);
      reset();
    }
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">New password</Label>
            <Controller
              control={control}
              name="newPassword"
              render={({ field }) => (
                <PasswordInput
                  {...field}
                  id="newPassword"
                  autoComplete="new-password"
                  placeholder="Enter new password"
                />
              )}
            />
            {errors.newPassword && (
              <p className="text-sm font-medium text-destructive">
                {errors.newPassword.message}
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
            Reset password
          </LoadingButton>
        </form>
      </CardContent>
    </Card>
  );
}
