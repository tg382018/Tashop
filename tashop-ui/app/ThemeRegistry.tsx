"use client";

import { ReactNode } from "react";
import { Container, CssBaseline } from "@mui/material";
import Header from "./header/header";
import Providers from "./provider";
import logout from "./auth/logout";

type ThemeRegistryProps = {
  children: ReactNode;
  authenticated: boolean;
};

export default function ThemeRegistry({
  children,
  authenticated,
}: ThemeRegistryProps) {
  return (
    <Providers authenticated={authenticated}>
      <CssBaseline /> 
      <Header logout={logout} />
      <Container className="mt-10">{children}</Container>
    </Providers>
  );
}
    