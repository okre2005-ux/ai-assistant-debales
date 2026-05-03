import { cookies } from "next/headers";
import { connectDB } from "./db";
import { User } from "../models/User";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const email = cookieStore.get("demo-user-email")?.value;

  if (!email) {
    return null;
  }

  await connectDB();

  const user = await User.findOne({ email });

  if (!user) {
    return null;
  }

  return user;
}
