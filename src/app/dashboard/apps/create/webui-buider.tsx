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
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createApp } from "@/lib/apps";
import { CreateAppRequest } from "@/types/apps";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { FeatureTypes } from "../constants";

const appSchema = z.object({
  name: z.string().min(1, "Name is required"),
  supported_models: z
    .array(z.string())
    .min(1, "At least one model must be selected"),
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

// Created a separate component for the prompt field
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

export default function WebUIFormBuilder({ models }: { models: Option[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<AppFormValues>({
    resolver: zodResolver(appSchema),
    defaultValues: {
      name: "",
      supported_models: [],
      config: {
        title: "",
        logo: "",
        bot_name: "",
        suggested_prompt: [""],
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "config.suggested_prompt",
  });

  const onSubmit = async (data: CreateAppRequest) => {
    try {
      console.log(data);
      setIsSubmitting(true);
      await createApp({ ...data, ...{ feature_type: FeatureTypes.WebUI } });
      router.push("/dashboard/apps");
    } catch (error) {
      console.error("Failed to create app:", error);
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
          render={() => (
            <FormItem>
              <FormLabel>Supported Models</FormLabel>
              <MultipleSelector
                value={models.filter((model) =>
                  (form.watch("supported_models") || []).includes(model.value)
                )}
                options={models}
                placeholder="Select models..."
                emptyIndicator={
                  <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                    no results found.
                  </p>
                }
                onChange={(newSelected) => {
                  form.setValue(
                    "supported_models",
                    newSelected.map((item: { value: string }) => item.value),
                    {
                      shouldValidate: true,
                    }
                  );
                }}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-right gap-4 flex-direction-[row-reverse]">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
          <Button asChild>
            <Link href="/dashboard/apps">Cancel</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}
