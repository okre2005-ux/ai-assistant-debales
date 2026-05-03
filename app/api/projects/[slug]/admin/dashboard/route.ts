import { NextResponse } from "next/server";
import { requireAdminAccess } from "../../../../../../services/projectService";
import { Conversation } from "../../../../../../models/Conversation";
import { DashboardConfig } from "../../../../../../models/DashboardConfig";
import { Message } from "../../../../../../models/Message";
import { ProductInstance } from "../../../../../../models/ProductInstance";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;

    const { project } = await requireAdminAccess(slug);

    const config = await DashboardConfig.findOne({
      projectId: project._id,
    });

    const productInstance = await ProductInstance.findOne({
      projectId: project._id,
    });

    const conversationIds = await Conversation.find({
      projectId: project._id,
    }).distinct("_id");

    const totalConversations = conversationIds.length;

    const totalMessages = await Message.countDocuments({
      conversationId: {
        $in: conversationIds,
      },
    });

    const activeIntegrations = [
      productInstance?.integrations?.shopify?.enabled,
      productInstance?.integrations?.crm?.enabled,
    ].filter(Boolean).length;

    const recentConversations = await Conversation.find({
      projectId: project._id,
    })
      .sort({
        updatedAt: -1,
      })
      .limit(5);

    return NextResponse.json({
      config,
      metrics: {
        totalConversations,
        totalMessages,
        activeIntegrations,
      },
      recentConversations,
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
