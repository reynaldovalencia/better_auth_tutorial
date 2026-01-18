"use client";

import { LoadingButton } from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserAvatar } from "@/components/user-avatar";
import { User } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  image: z.string().optional().nullable(),
});

export type UpdateProfileValues = z.infer<typeof updateProfileSchema>;

interface ProfileDetailsFormProps {
  user: User;
}

export function ProfileDetailsForm({ user }: ProfileDetailsFormProps) {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // TODO: Render real user info
  // const user = {
  //   name: "John Doe",
  //   image: undefined,
  // };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name ?? "",
      image: user.image ?? null,
    },
  });

  async function onSubmit({ name, image }: UpdateProfileValues) {
    setStatus(null);
    setError(null);

    const { error } = await authClient.updateUser({ name, image });

    if (error) {
      setError(
        error.message || "An error occurred while updating the profile.",
      );
    } else {
      setStatus("Profile updated successfully.");
      router.refresh();
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setValue("image", base64, { shouldDirty: true });
      };
      reader.readAsDataURL(file);
    }
  }

  const imagePreview = watch("image");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          {/* Name Field */}
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Full name" {...register("name")} />
            {errors.name && (
              <p className="text-sm font-medium text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Image Field */}
          <div className="grid gap-2">
            <Label htmlFor="image">Profile image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {errors.image && (
              <p className="text-sm font-medium text-destructive">
                {errors.image.message}
              </p>
            )}
          </div>

          {imagePreview && (
            <div className="relative size-16">
              <UserAvatar
                name={user.name}
                image={imagePreview}
                className="size-16"
              />
              <Button
                type="button"
                variant="ghost"
                className="absolute -top-2 -right-2 size-6 rounded-full"
                onClick={() => setValue("image", null)}
                aria-label="Remove image"
              >
                <XIcon className="size-4" />
              </Button>
            </div>
          )}

          {error && (
            <div role="alert" className="text-sm text-red-600">
              {error}
            </div>
          )}
          {status && (
            <div role="status" className="text-sm text-green-600">
              {status}
            </div>
          )}

          <LoadingButton type="submit" loading={isSubmitting}>
            Save changes
          </LoadingButton>
        </form>
      </CardContent>
    </Card>
  );
}
