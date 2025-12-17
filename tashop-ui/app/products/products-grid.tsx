"use client"

import Product from "./product";
import {Product as IProduct} from "./interface/product-interface"
import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import API_URL from "../common/constants/api";
import revalidateProducts from "./actions/revalidate-products";
import authenticated from "../auth/action/authenticated";

interface ProductGridProps{
    products:IProduct[];

}

export default function ProductsGrid({products}:ProductGridProps){

    useEffect(()=>{
        let socket:Socket | undefined
        let alive = true;
        const createSocket=async()=>{
          const token = await authenticated();
          if (!token) {
            console.warn("[ws] no auth token -> skipping socket connection");
            return;
          }

          const s = io(API_URL!, { auth: { Authentication: token } }); //
          socket = s;

        s.on("connect", () => {
          console.info("[ws] connected", { id: s.id });
        });
        s.on("disconnect", (reason) => {
          console.info("[ws] disconnected", { reason });
        });
        s.on("connect_error", (err) => {
          console.error("[ws] connect_error", err?.message ?? err);
        });

        s.on('productUpdated',()=>{
          console.info("[ws] productUpdated received -> revalidateProducts()");
          revalidateProducts()
        });

        // If we were unmounted while awaiting token, immediately clean up.
        if (!alive) {
          s.disconnect();
        }
        };
        createSocket();
    
        return() => {
          alive = false;
          socket?.disconnect();
        };
    }
    ,[])
    
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