import { Conversation } from "../models/Conversation";
import { Message } from "../models/Message";
import { ProductInstance } from "../models/ProductInstance";

type SendMessageParams = {
  projectId: string;
  content: string;
  conversationId?: string;
};

export async function sendChatMessage({
  projectId,
  content,
  conversationId,
}: SendMessageParams) {
  const productInstance = await ProductInstance.findOne({
    projectId,
  });

  if (!productInstance) {
    throw new Error("Product instance not found");
  }

  let conversation = conversationId
    ? await Conversation.findById(conversationId)
    : null;

  if (!conversation) {
    conversation = await Conversation.create({
      projectId,
      productInstanceId: productInstance._id,
      title: content.slice(0, 40),
    });
  }

  const userMessage = await Message.create({
    conversationId: conversation._id,
    role: "user",
    content,
  });

  const steps: string[] = ["Reading project configuration"];

  if (productInstance.integrations?.shopify?.enabled) {
    steps.push("Checking Shopify mock data");
  }

  if (productInstance.integrations?.crm?.enabled) {
    steps.push("Checking CRM mock data");
  }

  steps.push("Preparing assistant response");

  const assistantText = await buildAssistantReply(content, {
    shopifyEnabled: productInstance.integrations?.shopify?.enabled,
    crmEnabled: productInstance.integrations?.crm?.enabled,
  });

  const assistantMessage = await Message.create({
    conversationId: conversation._id,
    role: "assistant",
    content: assistantText,
    steps,
  });

  return {
    conversation,
    messages: [userMessage, assistantMessage],
  };
}

async function buildAssistantReply(
  content: string,
  integrations: {
    shopifyEnabled?: boolean;
    crmEnabled?: boolean;
  }
) {
  if (process.env.GEMINI_API_KEY) {
    return callGemini(content, integrations);
  }

  return buildMockReply(content, integrations);
}

function buildMockReply(
  content: string,
  integrations: {
    shopifyEnabled?: boolean;
    crmEnabled?: boolean;
  }
) {
  const enabledTools: string[] = [];

  if (integrations.shopifyEnabled) {
    enabledTools.push("Shopify");
  }

  if (integrations.crmEnabled) {
    enabledTools.push("CRM");
  }

  if (enabledTools.length === 0) {
    return `I received: "${content}". No integrations are enabled for this project yet.`;
  }

  const lowerContent = content.toLowerCase();

  if (
    integrations.shopifyEnabled &&
    (lowerContent.includes("sales") ||
      lowerContent.includes("order") ||
      lowerContent.includes("cart"))
  ) {
    return "Using Shopify mock data: today's sales are Rs 24,650 from 7 orders. Average order value is Rs 3,521.";
  }

  if (
    integrations.crmEnabled &&
    (lowerContent.includes("lead") ||
      lowerContent.includes("crm") ||
      lowerContent.includes("follow") ||
      lowerContent.includes("deal"))
  ) {
    return "Using CRM mock data: there are 5 new leads today, 3 warm leads, 4 follow-ups due, and 2 closed deals.";
  }

  return `I received: "${content}". I used ${enabledTools.join(
    " and "
  )} mock data to prepare this answer.`;
}

async function callGemini(
  content: string,
  integrations: {
    shopifyEnabled?: boolean;
    crmEnabled?: boolean;
  }
) {
  const enabledTools = [
    integrations.shopifyEnabled ? "Shopify mock data" : null,
    integrations.crmEnabled ? "CRM mock data" : null,
  ].filter(Boolean);

  const mockBusinessData = `
Shopify mock data:
- Today's sales: Rs 24,650
- Orders today: 7
- Average order value: Rs 3,521
- Top product: Wireless Keyboard
- Abandoned carts today: 3
- Pending refunds: 1

CRM mock data:
- New leads today: 5
- Warm leads: 3
- Follow-ups due today: 4
- Closed deals today: 2
- Estimated CRM pipeline value: Rs 86,000
- Highest priority lead: Ananya Sharma
`;

  const prompt = `
You are an AI Sales Assistant for a multi-tenant demo app.

User message:
${content}

Enabled integrations:
${enabledTools.length > 0 ? enabledTools.join(", ") : "None"}

Available mock business data:
${mockBusinessData}

Rules:
- If the user asks for sales, orders, carts, refunds, or products, answer using Shopify mock data if Shopify is enabled.
- If the user asks for leads, follow-ups, customers, deals, or pipeline, answer using CRM mock data if CRM is enabled.
- If the needed integration is disabled, clearly say it is disabled.
- Do not say you can fetch data later. Use the available mock data immediately.
- Keep the answer short, useful, and specific.
- Mention which enabled integration you used.
`;

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY!,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API failed:", response.status, errorText);
      return buildMockReply(content, integrations);
    }

    const data = await response.json();

    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      buildMockReply(content, integrations)
    );
  } catch (error) {
    console.error("Gemini request crashed:", error);
    return buildMockReply(content, integrations);
  }
}
