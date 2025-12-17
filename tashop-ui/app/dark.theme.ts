"use client"

import { createTheme } from "@mui/material";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#7C3AED" }, // violet
    secondary: { main: "#22C55E" }, // green
    background: {
      default: "#0B1020",
      paper: "rgba(255,255,255,0.06)",
    },
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: `var(--font-geist-sans), ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial`,
    h2: { fontWeight: 800, letterSpacing: -0.6 },
    h4: { fontWeight: 750, letterSpacing: -0.3 },
    h5: { fontWeight: 700, letterSpacing: -0.2 },
    subtitle1: { color: "rgba(255,255,255,0.75)" as any },
  },
  components: {
    MuiContainer: {
      defaultProps: { maxWidth: "lg" },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          border: "1px solid rgba(255,255,255,0.08)",
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04))",
          backdropFilter: "blur(10px)",
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 700, borderRadius: 14 },
      },
    },
    MuiTextField: {
      defaultProps: { fullWidth: true, size: "medium" },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid rgba(255,255,255,0.10)",
        },
      },
    },
  },
});