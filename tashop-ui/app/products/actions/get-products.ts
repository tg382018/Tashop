"use server"

import { get } from "@/app/common/util/fetch";
import { Product } from "../interface/product-interface";

export default async function getProducts(){
    return get<Product[]>("products",["products"],new URLSearchParams({status:'availible'}));
}