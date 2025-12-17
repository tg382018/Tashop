"use client"

import { Alert, Button, Link, Stack, TextField, Typography } from "@mui/material";
import { useActionState } from "react";
import login from "./login";

export default function Login()
{
        const [state,formAction]=useActionState(login,{error:""});
    
    return(
          <form action={formAction} noValidate>
            <Stack spacing={2.5}>
              <Stack spacing={0.75}>
                <Typography variant="h4">Welcome back</Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Log in to manage your products and purchases.
                </Typography>
              </Stack>

              {!!state.error && <Alert severity="error">{state.error}</Alert>}

              <TextField
                name="email"
                label="Email"
                type="email"
                autoComplete="email"
                required
                error={!!state.error}
              />
              <TextField
                name="password"
                label="Password"
                type="password"
                autoComplete="current-password"
                required
                error={!!state.error}
              />

              <Button type="submit" variant="contained" size="large">
                Log in
              </Button>

              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Don&apos;t have an account?{" "}
                <Link href="/auth/signup" underline="hover">
                  Sign up
                </Link>
              </Typography>
            </Stack>
          </form>
    );
}