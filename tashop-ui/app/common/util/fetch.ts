'use server';


import { cookies } from "next/headers";
import { getErrorMessage } from "./errors";
import API_URL from "../constants/api";

export const getCookieHeader = async (): Promise<Record<string, string>> => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  return cookieHeader ? { Cookie: cookieHeader } : {};
};

const defaultHeaders = {
  "Content-Type": "application/json",
};
export const post = async (path: string, formData: FormData) => {
  const res = await fetch(`${API_URL}/${path}`, {
    method: "POST",
    headers: {
      ...defaultHeaders,
      ...(await getCookieHeader()),
    },
    body: JSON.stringify(Object.fromEntries(formData)),
  });
  const parsedRes = await res.json();
  if (!res.ok) {
    return { error: getErrorMessage(parsedRes) };
  }
  return { error: "" ,data:parsedRes};
};


export const get = async <T>(path: string,tags?:string[]) => {
  const res = await fetch(`${API_URL}/${path}`, {
    headers: {
      ...(await getCookieHeader()),
    },
    next:{tags}
  });
  return res.json() as T;
};