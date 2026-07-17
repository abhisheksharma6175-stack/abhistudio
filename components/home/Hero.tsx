"use client";

import Link from "next/link";

import { Box, Button, Container, Grid, Typography } from "@mui/material";

export default function Hero() {
  return (
    <Box
      sx={{
        backgroundImage:
          'linear-gradient(90deg, rgba(17, 17, 17, 0.94) 0%, rgba(17, 17, 17, 0.72) 48%, rgba(17, 17, 17, 0.3) 100%), url("/images/hero-banner.jpg")',
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        color: "#fff",
        py: { xs: 8, md: 12 },
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={6} sx={{ alignItems: "center" }}>
          {/* Left Side */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              sx={{
                color: "#FFD700",
                fontWeight: 600,
                mb: 2,
              }}
            >
              Premium Hair Care
            </Typography>

            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                mb: 3,
                lineHeight: 1.2,
              }}
            >
              Luxury Hair Products & Professional Salon Services
            </Typography>

            <Typography
              sx={{
                color: "#cfcfcf",
                fontSize: 18,
                mb: 4,
                maxWidth: 550,
              }}
            >
              Discover premium shampoos, conditioners, hair treatments and
              professional salon services designed to keep your hair healthy,
              shiny and beautiful.
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Button
                component={Link}
                href="/products"
                variant="contained"
                sx={{
                  bgcolor: "#FFD700",
                  color: "#000",
                  px: 4,
                  py: 1.5,
                  borderRadius: "30px",
                  fontWeight: 600,

                  "&:hover": {
                    bgcolor: "#e6c200",
                  },
                }}
              >
                Shop Products
              </Button>

              <Button
                component={Link}
                href="/services"
                variant="outlined"
                sx={{
                  color: "#FFD700",
                  borderColor: "#FFD700",
                  px: 4,
                  py: 1.5,
                  borderRadius: "30px",

                  "&:hover": {
                    borderColor: "#FFD700",
                    bgcolor: "#FFD700",
                    color: "#000",
                  },
                }}
              >
                View Services
              </Button>
            </Box>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}
