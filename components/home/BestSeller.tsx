"use client";

import Link from "next/link";
import Image from "next/image";
import { Box, Container, Grid, Typography, Button, Rating } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function BestSeller() {
  const handleAddToCart = () => {
    const currentCount = parseInt(localStorage.getItem("cartCount") || "0") + 1;
    localStorage.setItem("cartCount", currentCount.toString());
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <Box sx={{ py: 12, bgcolor: "#1b1b1b", borderTop: "1px solid #2b2b2b" }}>
      <Container maxWidth="xl">
        <Grid container spacing={8} sx={{ alignItems: "center" }}>
          {/* Left Side: Product Image */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                position: "relative",
                height: { xs: 350, sm: 450, md: 550 },
                borderRadius: 6,
                overflow: "hidden",
                border: "1px solid #2b2b2b",
                boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
              }}
            >
              <Image
                src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop"
                alt="Spotlight Skin Serum Bestseller"
                fill
                style={{ objectFit: "cover" }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: 24,
                  left: 24,
                  bgcolor: "#FFD700",
                  color: "#000",
                  px: 2.5,
                  py: 1,
                  borderRadius: "20px",
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: 1,
                  boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                }}
              >
                BEST SELLER
              </Box>
            </Box>
          </Grid>

          {/* Right Side: Product Details */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="h6"
              sx={{
                color: "#FFD700",
                fontWeight: 600,
                mb: 1.5,
                letterSpacing: 2,
              }}
            >
              PRODUCT SPOTLIGHT
            </Typography>

            <Typography
              variant="h3"
              sx={{
                color: "#fff",
                fontWeight: 700,
                mb: 3,
                lineHeight: 1.2,
              }}
            >
              Hydrating Hyaluronic Face Serum
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
              <Rating value={5} readOnly />
              <Typography sx={{ color: "#fff", fontWeight: 600 }}>5.0 / 5.0</Typography>
              <Typography sx={{ color: "#a0a0a0" }}>(124 customer reviews)</Typography>
            </Box>

            <Typography
              sx={{
                color: "#cfcfcf",
                fontSize: 18,
                lineHeight: 1.8,
                mb: 4,
              }}
            >
              Our #1 best seller skincare formula. Enriched with 2% Hyaluronic Acid, Organic Aloe Extract, and Provitamin B5, this moisture-boosting serum restores intense hydration, smooths fine lines, and delivers a luminous, glass-skin complexion in just 7 days.
            </Typography>

            {/* Key Benefits */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 5 }}>
              {[
                "Provides deep 24-hour hydration to outer and inner skin layers",
                "Visible reduction in fine lines and textured spots in 7 days",
                "Non-greasy, lightweight, and fast-absorbing formula",
                "100% vegan, cruelty-free, and clean organic formulation",
              ].map((benefit) => (
                <Box key={benefit} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <CheckCircleIcon sx={{ color: "#FFD700" }} />
                  <Typography sx={{ color: "#fff" }}>{benefit}</Typography>
                </Box>
              ))}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
              <Box>
                <Typography sx={{ color: "#a0a0a0", textDecoration: "line-through", fontSize: 16 }}>
                  $45.00
                </Typography>
                <Typography variant="h3" sx={{ color: "#FFD700", fontWeight: 700 }}>
                  $34.99
                </Typography>
              </Box>

              <Button
                onClick={handleAddToCart}
                variant="contained"
                sx={{
                  bgcolor: "#FFD700",
                  color: "#000",
                  px: 5,
                  py: 1.8,
                  borderRadius: "30px",
                  fontWeight: 600,
                  fontSize: 16,

                  "&:hover": {
                    bgcolor: "#e6c200",
                  },
                }}
              >
                Add to Cart
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
