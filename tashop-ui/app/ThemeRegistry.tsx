"use client"

import * as React from "react";
import { darkTheme } from "@/app/dark.theme";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { Container, CssBaseline, ThemeProvider } from "@mui/material";

export default function ThemeRegistry
(
    {
        children,
    }:
    {
        children:React.ReactNode;
    }
)
{
    return (
              <AppRouterCacheProvider>

          <ThemeProvider theme={darkTheme}>
            <CssBaseline/>
            <Container>
               {children}
              </Container>
          
          </ThemeProvider>
       
        </AppRouterCacheProvider>
    );
}