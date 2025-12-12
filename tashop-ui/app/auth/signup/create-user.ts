'use server'

import { post } from "@/app/common/util/fetch";
import { redirect } from "next/navigation";
 

type SignupActionState = { error: string };

export default async function createUser(
  _prevState: SignupActionState,
  formData: FormData
): Promise<SignupActionState> {
  const { error } = await post("users", formData);
  if (error) {
    return { error };
  }

  redirect("/");
  return { error: "" };
}