"use client";

import Link from "next/link";
import { Box, Container, Typography, Button, Paper } from "@mui/material";

export default function OfferBanner() {
  return (
    <Box sx={{ py: 6, bgcolor: "#111" }}>
      <Container maxWidth="xl">
        <Paper
          elevation={0}
          sx={{
            backgroundImage:
              'linear-gradient(90deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 50%, rgba(0, 0, 0, 0.3) 100%), url("https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1200&auto=format&fit=crop")',
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            color: "#fff",
            borderRadius: 6,
            overflow: "hidden",
            p: { xs: 6, md: 8 },
            border: "1px solid #2b2b2b",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Box
            sx={{
              bgcolor: "#FFD700",
              color: "#000",
              px: 2,
              py: 0.5,
              borderRadius: 2,
              fontWeight: 700,
              fontSize: 14,
              mb: 3,
              letterSpacing: 1,
            }}
          >
            LIMITED TIME OFFER
          </Box>

          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 2,
              maxWidth: 600,
              lineHeight: 1.2,
              fontSize: { xs: "2.2rem", sm: "3rem", md: "3.5rem" },
            }}
          >
            First Visit Special: Get 20% Off Services!
          </Typography>

          <Typography
            sx={{
              color: "#cfcfcf",
              fontSize: { xs: 16, md: 18 },
              mb: 4,
              maxWidth: 500,
              lineHeight: 1.6,
            }}
          >
            Treat yourself to a luxury hair service, skincare treatment, or nail makeover. Use code <strong style={{ color: "#FFD700" }}>STUDIO20</strong> at checkout or show it to your stylist.
          </Typography>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              component={Link}
              href="/services"
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
              Book Now
            </Button>
            <Button
              component={Link}
              href="/products"
              variant="outlined"
              sx={{
                color: "#FFD700",
                borderColor: "#FFD700",
                px: 4,
                py: 1.5,
                borderRadius: "30px",
                fontWeight: 600,

                "&:hover": {
                  borderColor: "#FFD700",
                  bgcolor: "rgba(255, 215, 0, 0.05)",
                },
              }}
            >
              Shop Sale Products
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
