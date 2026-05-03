import { NextRequest, NextResponse } from "next/server";

const demoUsers = {
  admin: "admin@debales.ai",
  member: "member@debales.ai",
};

export function GET(request: NextRequest) {
  const role = request.nextUrl.searchParams.get("role");

  if (role !== "admin" && role !== "member") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Create absolute URL for redirect
  const redirectUrl = new URL("/projects/debales-demo/chat", request.url);
  const response = NextResponse.redirect(redirectUrl);

  response.cookies.set("demo-user-email", demoUsers[role], {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}