"use client"

import { Button, Link, Stack, TextField } from "@mui/material";
import { useActionState } from "react";

import createUser from "./create-user";

export default function Signup()
{
    const [state,formAction]=useActionState(createUser,{error:""});

    return(
        <form action={formAction}>
     <Stack spacing={2} className="w-full max-w-xs">
              

                < TextField name="email" label="Email" variant="outlined" type="email" 
                helperText={state.error}
                error={!!state.error}

                />
                < TextField name="password" label="Password" variant="outlined" type="password"
                                helperText={state.error}
                error={!!state.error}
                />
                <Button type="submit" variant="contained">Signup</Button>
                <Link   href="/auth/login">Login</Link>
            </Stack>
        </form>
      
    );
}