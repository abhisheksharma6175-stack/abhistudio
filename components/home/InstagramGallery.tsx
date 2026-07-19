"use client";

import Image from "next/image";
import { Box, Container, Grid, Typography } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";

const galleryImages = [
  {
    url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=400&auto=format&fit=crop",
    alt: "Precision Haircut",
  },
  {
    url: "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=400&auto=format&fit=crop",
    alt: "Hair Coloring Studio",
  },
  {
    url: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=400&auto=format&fit=crop",
    alt: "Skincare Hydration Treatment",
  },
  {
    url: "https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=400&auto=format&fit=crop",
    alt: "Gel Nail Art Care",
  },
  {
    url: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?q=80&w=400&auto=format&fit=crop",
    alt: "Gentlemen Grooming Barber",
  },
  {
    url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=400&auto=format&fit=crop",
    alt: "Bridal Styling Makeover",
  },
];

export default function InstagramGallery() {
  return (
    <Box sx={{ py: 10, bgcolor: "#111", borderTop: "1px solid #2b2b2b" }}>
      <Container maxWidth="xl">
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, mb: 1 }}>
          <InstagramIcon sx={{ color: "#FFD700" }} />
          <Typography
            variant="h6"
            sx={{
              color: "#FFD700",
              fontWeight: 600,
              letterSpacing: 2,
            }}
          >
            @ABHISTUDIO
          </Typography>
        </Box>

        <Typography
          variant="h3"
          sx={{
            color: "#fff",
            textAlign: "center",
            fontWeight: 700,
            mb: 6,
          }}
        >
          Follow Us on Instagram
        </Typography>

        <Grid container spacing={2}>
          {galleryImages.map((img, idx) => (
            <Grid key={idx} size={{ xs: 6, sm: 4, md: 2 }}>
              <Box
                sx={{
                  position: "relative",
                  height: 200,
                  borderRadius: 3,
                  overflow: "hidden",
                  cursor: "pointer",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: "rgba(0,0,0,0.5)",
                    opacity: 0,
                    transition: "opacity .3s ease",
                  },
                  "&:hover::after": {
                    opacity: 1,
                  },
                  "&:hover img": {
                    transform: "scale(1.1)",
                  },
                }}
              >
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  style={{
                    objectFit: "cover",
                    transition: "transform .3s ease",
                  }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
