import { get } from "@/app/common/util/fetch";
import { Product } from "../interface/product-interface";

export default function getProduct(productId:number){
    return get<Product>(`products/${productId}`);

}