import { Card, Stack, Typography } from "@mui/material";
import type { Product } from "./interface/product-interface";
import API_URL from "../common/constants/api";
import Image from "next/image";

//product interfacesinde props tanımlıyoruz
interface ProductProps {
    product: Product;
} 

export default function Product({product}:ProductProps){//bu interface tipinde ürünü getir diyoruz
    return(
        <Card className="p-4">
            <Stack gap={3}>
          <Typography variant="h4">{product.name}
            </Typography>
                {product.imageExist&&(
                    <img
                      src={`http://localhost:3003/images/products/${product.id}.png`}
                    sizes="100vw" 
               width={500}  
            height={500}
                    className="w-full h-auto" 
                    alt="Picture of the product" />
                )}
               <Typography variant="h4">{product.description}
            </Typography>

               <Typography variant="h4">${product.price}
            </Typography>
            </Stack>
  
        </Card>
    );
}