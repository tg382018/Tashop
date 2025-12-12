"use client"

import { Button, Stack, TextField } from "@mui/material";
import Link from "next/link";
import { useActionState } from "react";
import login from "./login";

export default function Login()
{
        const [state,formAction]=useActionState(login,{error:""});
    
    return(
          <form action={formAction} className="w-full max-w-xs">
       <Stack spacing={2} >
                
  
                  < TextField name="email" label="Email" variant="outlined" type="email" 
                  helperText={state.error}
                  error={!!state.error}
  
                  />
                  < TextField name="password" label="Password" variant="outlined" type="password"
                                  helperText={state.error}
                  error={!!state.error}
                  />
                  <Button type="submit" variant="contained">Login</Button>
                  <Link   href="/auth/signup">Signup</Link>
              </Stack>
          </form>
    );
}