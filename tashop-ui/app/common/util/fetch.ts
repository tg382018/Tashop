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
export const post = async (path: string, data: FormData|object) => {
  const body=data instanceof FormData ? Object.fromEntries(data):data;
  const url = `${API_URL}/${path}`;
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        ...defaultHeaders,
        ...(await getCookieHeader()),
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    const e = err as any;
    const cause = e?.cause ? ` cause=${e.cause.code ?? e.cause.message ?? String(e.cause)}` : "";
    throw new Error(`POST fetch failed url=${url}.${cause}`, { cause: err as any });
  }
  const parsedRes = await res.json();
  if (!res.ok) {
    return { error: getErrorMessage(parsedRes) };
  }
  return { error: "" ,data:parsedRes};
};


export const get = async <T>(
  path: string,
  tags?: string[], //bu fetch i X tagiyle alırız ve revalidate yaptığımız zaman fetch tekrar çalışır
  params?: URLSearchParams
) => {
  const url = params
    ? `${API_URL}/${path}?${params.toString()}`
    : `${API_URL}/${path}`;

  let res: Response;
  try {
    res = await fetch(url, {
      headers: {
        ...(await getCookieHeader()),
      },
      next:{tags}//burda kulanıyoruz tag i 
    });
  } catch (err) {
    const e = err as any;
    const cause = e?.cause ? ` cause=${e.cause.code ?? e.cause.message ?? String(e.cause)}` : "";
    throw new Error(`GET fetch failed url=${url}.${cause}`, { cause: err as any });
  }
  return res.json() as T;
};