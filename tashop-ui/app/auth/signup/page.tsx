"use client"

import { Alert, Button, Link, Stack, TextField, Typography } from "@mui/material";
import { useActionState } from "react";

import createUser from "./create-user";

export default function Signup()
{
    const [state,formAction]=useActionState(createUser,{error:""});

    return(
        <form action={formAction} noValidate>
          <Stack spacing={2.5}>
            <Stack spacing={0.75}>
              <Typography variant="h4">Create your account</Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Sign up to start listing products and buying securely.
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
              autoComplete="new-password"
              required
              helperText="Use at least 8 characters."
              error={!!state.error}
            />

            <Button type="submit" variant="contained" size="large">
              Sign up
            </Button>

            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Already have an account?{" "}
              <Link href="/auth/login" underline="hover">
                Log in
              </Link>
            </Typography>
          </Stack>
        </form>
      
    );
}