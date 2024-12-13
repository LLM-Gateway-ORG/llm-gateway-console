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
import MultipleSelector, { Option } from "@/components/ui/multiple-selector"; // https://shadcnui-expansions.typeart.cc/docs/multiple-selector
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createApp } from "@/lib/apps";
import { CreateAppRequest } from "@/types/apps";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { FeatureTypes } from "../constants";

const appSchema = z.object({
  name: z.string().min(1, "Name is required"),
  supported_models: z
    .array(z.string())
    .min(1, "At least one model must be selected"),
  instructions: z.string(),
  config: z.object({
    bot_name: z.string().min(1, "Bot name is required"),
  }),
});

type AppFormValues = z.infer<typeof appSchema>;

export default function SdkFormBuilder({ models }: { models: Option[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<AppFormValues>({
    resolver: zodResolver(appSchema),
    defaultValues: {
      name: "",
      supported_models: [],
      instructions: "",
      config: {
        bot_name: "",
      },
    },
  });

  const onSubmit = async (data: CreateAppRequest) => {
    try {
      console.log(data);
      setIsSubmitting(true);
      await createApp({ ...data, ...{ feature_type: FeatureTypes.SDK } });
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
          name="instructions"
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
