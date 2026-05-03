import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireProjectAccess } from "../../../../../services/projectService";
import { Conversation } from "../../../../../models/Conversation";
import { Message } from "../../../../../models/Message";

const deleteConversationSchema = z.object({
  conversationId: z.string().min(1),
});

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const { project } = await requireProjectAccess(slug);

    const conversations = await Conversation.find({
      projectId: project._id,
    }).sort({
      updatedAt: -1,
    });

    return NextResponse.json({
      conversations,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Something went wrong",
      },
      {
        status: 403,
      }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const body = await request.json();

    const input = deleteConversationSchema.parse(body);
    const { project } = await requireProjectAccess(slug);

    const conversation = await Conversation.findOne({
      _id: input.conversationId,
      projectId: project._id,
    });

    if (!conversation) {
      return NextResponse.json(
        {
          error: "Conversation not found",
        },
        {
          status: 404,
        }
      );
    }

    await Message.deleteMany({
      conversationId: conversation._id,
    });

    await Conversation.deleteOne({
      _id: conversation._id,
    });

    return NextResponse.json({
      success: true,
    });
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
