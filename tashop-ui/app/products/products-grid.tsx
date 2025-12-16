"use client"

import Product from "./product";
import {Product as IProduct} from "./interface/product-interface"
import { useEffect } from "react";
import { io } from "socket.io-client";
import API_URL from "../common/constants/api";
import revalidateProducts from "./actions/revalidate-products";

interface ProductGridProps{
    products:IProduct[];

}

export default function ProductsGrid({products}:ProductGridProps){

    useEffect(()=>{
        const socket=io(API_URL!)
        socket.on('productUpdated',()=>{revalidateProducts()});
        return() => {socket.disconnect()};
    },[])
     if (!Array.isArray(products)) {
    // If backend returns an error object instead of an array, don't crash the page.
    return <div>Products could not be loaded.</div>;
  }
    return (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <div key={product.id}>
          <Product product={product} />
        </div>
            ))}
    </div>
    );
}