import { z } from "zod";

export const sendMessageSchema = z.object({
  conversationId: z.string().optional(),
  content: z.string().min(1, "Message is required").max(1000),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
