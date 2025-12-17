'use server';

import { cookies } from "next/headers";

export default async function authenticated() {
  // Return the raw JWT for websocket auth (not boolean).
  return (await cookies()).get("Authentication")?.value ?? null;
}
// layout tsx bunu kullanarak sorguluyor ve tüm uygulamaya dağıtıyor