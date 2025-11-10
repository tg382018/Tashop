import { Button, Link, Stack, TextField } from "@mui/material";

export default function Signup()
{
    return(
           <Stack spacing={2} className="w-full max-w-xs">
              

                < TextField label="Email" variant="outlined" type="email"/>
                < TextField label="Password" variant="outlined" type="password"/>
                <Button variant="contained">Signup</Button>
                <Link   href="/auth/login">Login</Link>
            </Stack>
    );
}