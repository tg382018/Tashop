import { Box, Divider, Grid, Paper, Stack, Typography } from "@mui/material";
import getProduct from "./get-product";
import API_URL from "@/app/common/constants/api";
import Checkout from "@/app/checkout/checkout";
 

interface SingleProductProps{
    params: Promise<{ productId: string }>;
} // PARAMS KULLANDIK ÇÜNKÜ BU SAYFA URL AÇILINCA AÇILAN PAGE TSX ÖRN PRODUCTS/7 YAZINCA NEXT BURAYI AÇAR SAYFA AÇILIRKEN URLDEKİ 7 BURADAN ALINIR

export default async function SingleProduct({params}:SingleProductProps)
{
 const getProductImage=(productId:number)=>{
        return `${API_URL}/images/products/${productId}.png`; //resim URL si üretiyor ZATEN RESİM VARKEN
    }
    const product=await getProduct(+(await params).productId); // + stringi number yapıyor
    return (
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <Paper sx={{ overflow: "hidden" }}>
                {product.imageExist ? (
                  <Box
                    component="img"
                    alt={`${product.name} image`}
                    src={getProductImage(product.id)}
                    sx={{
                      width: "100%",
                      aspectRatio: { xs: "4 / 3", md: "16 / 10" },
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: "100%",
                      aspectRatio: { xs: "4 / 3", md: "16 / 10" },
                      bgcolor: "rgba(255,255,255,0.06)",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      No image available
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12} md={5}>
              <Paper sx={{ p: { xs: 2.5, sm: 3 } }}>
                <Stack spacing={2}>
                  <Stack spacing={0.75}>
                    <Typography variant="h4">{product.name}</Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      Product details and secure checkout.
                    </Typography>
                  </Stack>

                  <Divider />

                  <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                    {product.description}
                  </Typography>

                  <Typography variant="h5" sx={{ fontWeight: 900 }}>
                    ${Number(product.price).toFixed(2)}
                  </Typography>

                  <Checkout productId={product.id} />
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Box>
    )
}