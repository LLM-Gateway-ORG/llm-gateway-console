"use client";

import { useState } from "react";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormLabel,
  FormItem,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MultiSelect } from "@/components/ui/multiple-selector";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createApp, updateApp } from "@/lib/apps";
import { Textarea } from "@/components/ui/textarea";
import { FeatureTypes } from "../constants";
import { MultiSelectOption } from "../types";
import { AppDetails, CreateAppRequest } from "@/types/apps";

const appSchema = z.object({
  name: z.string().min(1, "Name is required"),
  supported_models: z
    .array(z.string())
    .min(1, "At least one model must be selected"),
  instruction: z.string(),
  config: z.object({
    bot_name: z.string().min(1, "Bot name is required"),
  }),
});

type AppFormValues = z.infer<typeof appSchema>;

interface AppFormProps {
  app?: AppDetails;
  models: MultiSelectOption[];
}

export default function SdkAppForm({ app, models }: AppFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!app;

  const form = useForm<AppFormValues>({
    resolver: zodResolver(appSchema),
    defaultValues: {
      name: app?.name || "",
      supported_models: app?.supported_models || [],
      instruction: app?.instruction || "",
      config: {
        bot_name: app?.config.bot_name || "",
      },
    },
  });

  const onSubmit = async (data: AppFormValues) => {
    try {
      setIsSubmitting(true);
      if (isEditMode && app) {
        await updateApp(app.id, {
          ...data,
          feature_type: FeatureTypes.SDK,
        } as any);
      } else {
        await createApp({
          ...data,
          feature_type: FeatureTypes.SDK,
        } as CreateAppRequest);
      }
      if (!isEditMode) window.location.href = "/dashboard/apps";
    } catch (error) {
      console.error(
        `Failed to ${isEditMode ? "update" : "create"} app:`,
        error
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>App Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter app name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="config.bot_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bot Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter bot name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="instruction"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter the instruction" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="supported_models"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supported Models</FormLabel>
              <MultiSelect
                options={models}
                onValueChange={(newSelected) => {
                  form.setValue("supported_models", newSelected, {
                    shouldValidate: true,
                  });
                }}
                placeholder="Select models..."
                variant="inverted"
                animation={2}
                maxCount={3}
                defaultValue={field.value}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button asChild variant="outline">
            <Link href="/dashboard/apps">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : isEditMode
              ? "Update App"
              : "Create App"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
