"use client"

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  Stack,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { CSSProperties, ChangeEvent, useActionState, useState } from "react";
import createProduct from "../actions/create-product";
import CloudUploadIcon from "@mui/icons-material/CloudUpload"

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
        <Dialog open={open} onClose={handleModalClose} fullWidth maxWidth="sm">
          <DialogTitle sx={{ fontWeight: 800 }}>Create product</DialogTitle>
          <form action={formAction} noValidate>
            <DialogContent>
              <Stack spacing={2}>
                {!!state.error && <Alert severity="error">{state.error}</Alert>}

                <TextField name="name" label="Name" required placeholder="e.g. iPhone 15 Pro" />
                <TextField
                  name="description"
                  label="Description"
                  required
                  multiline
                  minRows={3}
                  placeholder="Add a short description (condition, accessories, shipping, etc.)"
                />

                <TextField
                  name="price"
                  label="Price"
                  required
                  type="number"
                  inputProps={{ min: 0, step: "0.01" }}
                />

                <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />}>
                  Upload product image
                  <Input
                    type="file"
                    name="image"
                    style={fileInputStyles}
                    inputProps={{ accept: "image/png,image/jpeg,image/webp" }}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      const file = event.currentTarget.files?.[0];
                      setFileName(file ? file.name : "");
                    }}
                  />
                </Button>

                {fileName ? (
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Selected: {fileName}
                  </Typography>
                ) : (
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Optional. PNG/JPG/WEBP up to 10MB.
                  </Typography>
                )}
              </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2.5 }}>
              <Button onClick={handleModalClose} color="inherit">
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                Create
              </Button>
            </DialogActions>
          </form>
        </Dialog>
    );
}
