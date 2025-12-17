"use client"

import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add"
import { useState } from "react";
import CreateProductModal from "./create-product-modal";
 

export default function CreateProductFab()
{
const [modalVisible,setModalVisible]=useState(false); //modalvisible false defaut, setmodal da bunu değiştirecek fonks
//    <CreateProductModal open={modalVisible} handleClose={()=>setModalVisible(false)} /> 
// modal tetiklenirken iki veriye göre tetikleniyor bir açılacak mı açılmayacak mı iki kapatacak fonksiyon
//Fab color="primary" onClick={()=>setModalVisible(true)}> bu modalvisible yi true yapıyor ve tekrar createproductmodal tetiklenir
// visible true olduğu için busefer model open olcaktır 
return(
        <>
        <CreateProductModal open={modalVisible} handleClose={()=>setModalVisible(false)} /> 
        
        <Fab
          color="primary"
          onClick={() => setModalVisible(true)}
          aria-label="Create product"
          sx={{
            position: "fixed",
            right: { xs: 16, sm: 24 },
            bottom: { xs: 16, sm: 24 },
          }}
        >
          <AddIcon />
        </Fab>
        </>
);
}