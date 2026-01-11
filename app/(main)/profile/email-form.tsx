"use client";

import { LoadingButton } from "@/components/loading-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Standard shadcn label or HTML label
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

export const updateEmailSchema = z.object({
  newEmail: z.string().email({ message: "Enter a valid email" }),
});

export type UpdateEmailValues = z.infer<typeof updateEmailSchema>;

interface EmailFormProps {
  currentEmail: string;
}

export function EmailForm({ currentEmail }: EmailFormProps) {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Destructure register and formState directly for cleaner code
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateEmailValues>({
    resolver: zodResolver(updateEmailSchema),
    defaultValues: {
      newEmail: currentEmail,
    },
  });

  async function onSubmit({ newEmail }: UpdateEmailValues) {
    setStatus(null);
    setError(null);

    const { error } = await authClient.changeEmail({
      newEmail,
      callbackURL: "/email-verified",
    });

    if (error) {
      setError(error.message || "Failed to initiate email change");
    } else {
      setStatus("Verification email sent to your current address");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Email</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Removed <Form> wrapper */}
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="newEmail">New Email</Label>
            <Input
              id="newEmail"
              type="email"
              placeholder="new@email.com"
              {...register("newEmail")}
              aria-invalid={errors.newEmail ? "true" : "false"}
            />
            {/* Manual error message instead of <FormMessage /> */}
            {errors.newEmail && (
              <p className="text-sm font-medium text-destructive">
                {errors.newEmail.message}
              </p>
            )}
          </div>

          {error && (
            <div role="alert" className="text-sm text-red-600 font-medium">
              {error}
            </div>
          )}
          {status && (
            <div role="status" className="text-sm text-green-600 font-medium">
              {status}
            </div>
          )}

          <LoadingButton type="submit" loading={isSubmitting}>
            Request change
          </LoadingButton>
        </form>
      </CardContent>
    </Card>
  );
}
