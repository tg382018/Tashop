'use server';

import { cookies } from "next/headers";

export default async function authenticated() {
  return !!(await cookies()).get("Authentication")?.value;
}
// layout tsx bunu kullanarak sorguluyor ve tüm uygulamaya dağıtıyor