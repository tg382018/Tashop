import { Box, Container, Paper } from "@mui/material";

export default function AuthLayout(
    {children,}
    :
    {
        children:React.ReactNode

    }
)

{
    return (
     
        <Box
          sx={{
            minHeight: { xs: "calc(100vh - 64px)", md: "calc(100vh - 64px)" },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            py: { xs: 4, md: 6 },
          }}
        >
          <Container maxWidth="sm">
            <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 } }}>
              {children}
            </Paper>
          </Container>
        </Box>
    );
}