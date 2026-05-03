import { NextRequest, NextResponse } from "next/server";
import { sendMessageSchema } from "../../../../../schemas/chatSchema";
import { requireProjectAccess } from "../../../../../services/projectService";
import { sendChatMessage } from "../../../../../services/chatService";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const body = await request.json();

    const input = sendMessageSchema.parse(body);
    const { project } = await requireProjectAccess(slug);

    const result = await sendChatMessage({
      projectId: project._id.toString(),
      conversationId: input.conversationId,
      content: input.content,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Something went wrong",
      },
      {
        status: 400,
      }
    );
  }
}
