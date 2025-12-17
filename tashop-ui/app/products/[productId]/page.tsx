import { Stack, Typography } from "@mui/material";
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
        <Stack gap={3} marginBottom={"2rem"}>
                <Typography variant="h2">
                {product.name}
                </Typography>
                {product.imageExist&&(<img className="w-auto md:w-1/2 h-auto" sizes="100vw" alt="picture of the product" 
                src={getProductImage(product.id)} />)
                }
                <Typography>
                    {product.description}
                </Typography>
                 <Typography variant="h4">
                    ${product.price}
                </Typography>
                <Checkout productId={product.id}/>
        </Stack>
    )
}