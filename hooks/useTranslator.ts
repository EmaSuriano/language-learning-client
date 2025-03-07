// src/hooks/useTranslator.ts
import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

// Define schemas for type safety
export const TranslationResponseSchema = z.object({
  translated_text: z.string(),
  source_language: z.string(),
  target_language: z.string(),
});

export const TranslationRequestSchema = z.object({
  user_id: z.number(),
  message: z.string(),
});

export type TranslationResponse = z.infer<typeof TranslationResponseSchema>;
export type TranslationRequest = z.infer<typeof TranslationRequestSchema>;

// API function for translation using GET (for shorter messages)
const translateMessage = async (
  params: TranslationRequest
): Promise<TranslationResponse> => {
  const response = await api.get(`/translator/`, { params });

  return TranslationResponseSchema.parse(response.data);
};

// React Query hook for translations
export const useTranslator = () => {
  return useMutation({ mutationFn: translateMessage });
};
