import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminAccess } from "../../../../../services/projectService";
import { ProductInstance } from "../../../../../models/ProductInstance";

const updateIntegrationsSchema = z.object({
  shopify: z.boolean(),
  crm: z.boolean(),
});

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const { project } = await requireAdminAccess(slug);

    const productInstance = await ProductInstance.findOne({
      projectId: project._id,
    });

    return NextResponse.json({
      integrations: productInstance?.integrations ?? {
        shopify: { enabled: false },
        crm: { enabled: false },
      },
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

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const body = await request.json();

    const input = updateIntegrationsSchema.parse(body);
    const { project } = await requireAdminAccess(slug);

    const productInstance = await ProductInstance.findOneAndUpdate(
      {
        projectId: project._id,
      },
      {
        integrations: {
          shopify: {
            enabled: input.shopify,
          },
          crm: {
            enabled: input.crm,
          },
        },
      },
      {
        new: true,
      }
    );

    return NextResponse.json({
      productInstance,
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
