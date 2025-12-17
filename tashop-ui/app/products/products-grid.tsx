"use client"

import Product from "./product";
import {Product as IProduct} from "./interface/product-interface"
import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import API_URL from "../common/constants/api";
import revalidateProducts from "./actions/revalidate-products";
import authenticated from "../auth/action/authenticated";
import { Alert, Box, Grid, Skeleton, Stack, Typography } from "@mui/material";

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

          const s = io(API_URL!, { auth: { Authentication: token } });
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
    },[])
    
     if (!Array.isArray(products)) {
    // If backend returns an error object instead of an array, don't crash the page.
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Products could not be loaded. Please refresh the page.
      </Alert>
    );
  }
  if (!products) {
    // extremely defensive, shouldn't happen
    return (
      <Grid container spacing={2}>
        {Array.from({ length: 6 }).map((_, idx) => (
          <Grid key={idx} size={{ xs: 12, sm: 6, md: 4 }}>
            <Skeleton variant="rounded" height={280} />
          </Grid>
        ))}
      </Grid>
    );
  }
    return (
      <Box>
        <Stack spacing={0.75} sx={{ mb: 3 }}>
          <Typography variant="h4">Products</Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Browse available listings. New products appear in real-time.
          </Typography>
        </Stack>

        {products.length === 0 ? (
          <Alert severity="info">No products yet. Create the first one with the + button.</Alert>
        ) : (
          <Grid container spacing={2.5} alignItems="stretch">
            {products.map((product) => (
              <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4 }} sx={{ display: "flex" }}>
                <Product product={product} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    );
}