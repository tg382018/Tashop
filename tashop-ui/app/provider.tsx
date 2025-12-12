"use client";

import { ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ReactNode } from "react";
import { darkTheme } from "./dark.theme";
import { AuthContext } from "./auth/auth-context";

interface ProviderProps {
  children: ReactNode;
  authenticated: boolean;
}

export default function Providers({
  children,
  authenticated,
}: ProviderProps) {
  return (
    //<AuthContext.Provider value={authenticated}> i kullanarak tüm ui da useContext(AuthContext); sorgusu yapılarak duruma göre component gösterme ve göstermeme yapılır

    <AppRouterCacheProvider>
      <ThemeProvider theme={darkTheme}>
       <AuthContext.Provider value={authenticated}>
          
          {children}
        </AuthContext.Provider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
