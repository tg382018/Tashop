"use client"

import { Box, Button, Input, Modal, Stack, TextField, Typography } from "@mui/material";
import { CSSProperties, ChangeEvent, useActionState, useState } from "react";
import { post } from "../../common/util/fetch";
import createProduct from "../actions/create-product";
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
const styles={
position:"absolute",
top:"50%",
left:"50%",
transform:"translate(-50%,-50%)",
width:400,
bgcolor:"background.paper",
border:"2px solid #000",
boxShadow:24,
p:4,
}

const fileInputStyles :CSSProperties    ={
    clip:"rect(0 0 0 0)",
    clipPath:"inset(60%)",
    height:1,
    overflow:"hidden",
    position:"absolute",
    bottom:0,
    left:0,
    whiteSpace:"nowrap",
    width:1,

}
interface CreateProductModalProps{
    open:boolean,
    handleClose:()=>void;
}
//interface ile aşağıdaki fonksiyonun hangi parametreleri HANGİ TİPLERDE alacağını söylüyoruz 

export default function CreateProductModal({open,handleClose}:CreateProductModalProps){
        const [state,formAction]=useActionState(createProduct,{error:""});
           const[fileName,setFileName]=useState("");

        const handleModalClose = () => {
            setFileName("");
            handleClose();
          };
    return(
        <Modal open={open} onClose={handleModalClose}>
            <Box sx={styles}>
            <form className="w-full max-w-xs" action={formAction}>
                     <Stack spacing={2}>
              

                < TextField name="name" label="Name" variant="outlined" required
                helperText={state.error}
                error={!!state.error}

                />
                < TextField name="description" 
                label="Description" 
                variant="outlined"
                 required
                 helperText={state.error}
                error={!!state.error}
                />

                  < TextField name="price" 
                label="Price" 
                variant="outlined"
                 required
                 helperText={state.error}
                error={!!state.error}
                />
                <Button variant="outlined" component="label" startIcon={<CloudUploadIcon/>}>
                Upload File
                <Input
                  type="file"
                  name="image"
                  style={fileInputStyles}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    const file = event.currentTarget.files?.[0];
                    setFileName(file ? file.name : "");
                  }}
                />
                </Button>
                <Typography>{fileName}</Typography>
                <Button type="submit" variant="contained">Submit</Button>
             
            </Stack>
            </form>
            </Box>
        </Modal>
    );
}
