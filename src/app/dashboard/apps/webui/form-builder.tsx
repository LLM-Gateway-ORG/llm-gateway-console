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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { MultiSelect } from "@/components/ui/multiple-selector";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createApp, updateApp } from "@/lib/apps";
import { AppDetails, CreateAppRequest } from "@/types/apps";
import { Plus, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { FeatureTypes } from "../constants";
import { MultiSelectOption } from "../types";

const appSchema = z.object({
  name: z.string().min(1, "Name is required"),
  supported_models: z
    .array(z.string())
    .min(1, "At least one model must be selected"),
  instruction: z.string(),
  config: z.object({
    title: z.string().min(1, "Title is required"),
    logo: z.string().url().optional().or(z.literal("")),
    bot_name: z.string().min(1, "Bot name is required"),
    suggested_prompt: z
      .array(z.string())
      .min(1, "At least one suggested prompt is required"),
  }),
});

type AppFormValues = z.infer<typeof appSchema>;

const PromptField = ({
  field,
  onRemove,
}: {
  field: any;
  onRemove: () => void;
}) => (
  <FormItem className="mb-4">
    <FormControl>
      <div className="flex items-center gap-2">
        <Input {...field} placeholder="Enter a suggested prompt" />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onRemove}
          className="shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </FormControl>
    <FormMessage />
  </FormItem>
);

interface WebUIAppFormProps {
  app?: AppDetails;
  models: MultiSelectOption[];
}

export default function WebUIAppForm({ app, models }: WebUIAppFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!app;

  const form = useForm<AppFormValues>({
    resolver: zodResolver(appSchema),
    defaultValues: {
      name: app?.name || "",
      supported_models: app?.supported_models || [],
      instruction: app?.instruction || "",
      config: {
        title: app?.config.title || "",
        logo: app?.config.logo || "",
        bot_name: app?.config.bot_name || "",
        suggested_prompt: app?.config.suggested_prompt || [""],
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "config.suggested_prompt",
  });

  const onSubmit = async (data: AppFormValues) => {
    try {
      setIsSubmitting(true);
      if (isEditMode && app) {
        await updateApp(app.id, {
          ...data,
          feature_type: FeatureTypes.WebUI,
        } as any);
      } else {
        await createApp({
          ...data,
          feature_type: FeatureTypes.WebUI,
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

        <div className="space-y-6">
          <FormField
            control={form.control}
            name="config.title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter title" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="config.logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logo URL</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="https://example.com/logo.png"
                  />
                </FormControl>
                <FormDescription>
                  Optional: Enter a URL for the app logo
                </FormDescription>
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

          <div className="space-y-4">
            <FormLabel>Suggested Prompts</FormLabel>
            {fields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`config.suggested_prompt.${index}`}
                render={({ field }) => (
                  <PromptField field={field} onRemove={() => remove(index)} />
                )}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append("")}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Prompt
            </Button>
          </div>
        </div>

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
