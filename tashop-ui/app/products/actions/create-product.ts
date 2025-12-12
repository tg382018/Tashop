'use server';

import { revalidateTag } from "next/cache";
import {  getCookieHeader, post } from "../../common/util/fetch";
import { redirect } from "next/navigation";
import API_URL from "@/app/common/constants/api";

type ProductActionState = { error: string };

export default async function createProduct(
  _prevState: ProductActionState,
  formData: FormData
): Promise<ProductActionState> {  
  const response = await post("products", formData);
  const productImage=formData.get("image");
  if(productImage instanceof File && !response.error)
    {
        await uploadProductImage(response.data.id,productImage)
    }
  revalidateTag("products","minutes"); //sayfayı yeniler ve tekrar çeker
  if (response.error) {
    return { error: response.error };
  }

  redirect("/");
}
async function uploadProductImage(productId:number,file:File){
  const formData=new FormData();
  formData.append("image",file);
  await fetch(`${API_URL}/products/${productId}/image`,{
    body:formData,
    method:'POST',
     headers: {
      ...(await getCookieHeader()),
    },
  })
}