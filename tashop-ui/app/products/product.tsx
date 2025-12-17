"use client"

import { Box, Card, CardActionArea, CardContent, Chip, Stack, Typography } from "@mui/material";
import type { Product } from "./interface/product-interface";
import { useRouter } from "next/navigation";
import API_URL from "../common/constants/api";


//product interfacesinde props tanımlıyoruz
interface ProductProps {
    product: Product;
} 

export default function Product({product}:ProductProps){//bu interface tipinde ürünü getir diyoruz
  const router=useRouter()
    return(
        <CardActionArea onClick={()=>router.push(`/products/${product.id}`)} sx={{ height: "100%" }}>
          <Card
            sx={{
              height: "100%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              transition: "transform 120ms ease, box-shadow 120ms ease",
              "&:hover": { transform: "translateY(-2px)" },
            }}
          >
            {product.imageExist ? (
              <Box
                component="img"
                alt={`${product.name} image`}
                src={`${API_URL}/images/products/${product.id}.png`}
                sx={{
                  width: "100%",
                  aspectRatio: "16 / 10",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            ) : (
              <Box
                sx={{
                  width: "100%",
                  aspectRatio: "16 / 10",
                  bgcolor: "rgba(255,255,255,0.06)",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  No image
                </Typography>
              </Box>
            )}

            <CardContent sx={{ p: 2.25, flexGrow: 1, display: "flex", flexDirection: "column" }}>
              <Stack spacing={1.25} sx={{ flexGrow: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      lineHeight: 1.2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      pr: 1,
                    }}
                    title={product.name}
                  >
                    {product.name}
                  </Typography>
                  <Chip
                    size="small"
                    label={`$${Number(product.price).toFixed(2)}`}
                    color="secondary"
                    variant="outlined"
                  />
                </Stack>

                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    minHeight: "3.6em",
                  }}
                >
                  {product.description}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </CardActionArea>
       
    );
}