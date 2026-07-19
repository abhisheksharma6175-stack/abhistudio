"use client";

import { Box, Container, Grid, Typography, Card, CardContent, Avatar, Rating } from "@mui/material";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";

const reviews = [
  {
    name: "Emma Watson",
    role: "Regular Customer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop",
    rating: 5,
    comment: "Abhi Studio has completely transformed my hair! Sarah Connor is an absolute genius with balayage highlights. The place is gorgeous and the service is incredibly premium.",
  },
  {
    name: "Liam Neeson",
    role: "Local Client",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop",
    rating: 5,
    comment: "I always come here for my beard grooming and haircut. The attention to detail is remarkable. Booking online takes seconds and they are always on time.",
  },
  {
    name: "Olivia Rodrigo",
    role: "Fashion Blogger",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=120&auto=format&fit=crop",
    rating: 5,
    comment: "The Hydrating Hyaluronic Serum is magic! It was recommended by Michael Chen during my skin consultation. My skin is glowing and has never felt this clear.",
  },
];

export default function Testimonials() {
  return (
    <Box sx={{ py: 10, bgcolor: "#1b1b1b", borderTop: "1px solid #2b2b2b" }}>
      <Container maxWidth="xl">
        <Typography
          variant="h6"
          sx={{
            color: "#FFD700",
            fontWeight: 600,
            textAlign: "center",
            mb: 1,
            letterSpacing: 2,
          }}
        >
          CLIENT TESTIMONIALS
        </Typography>

        <Typography
          variant="h3"
          sx={{
            color: "#fff",
            textAlign: "center",
            fontWeight: 700,
            mb: 6,
          }}
        >
          What Our Clients Say
        </Typography>

        <Grid container spacing={4}>
          {reviews.map((rev, index) => (
            <Grid key={index} size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  bgcolor: "#111",
                  borderRadius: 4,
                  border: "1px solid #2b2b2b",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  p: 2,
                  transition: "all .3s ease",

                  "&:hover": {
                    transform: "translateY(-8px)",
                    borderColor: "#FFD700",
                  },
                }}
              >
                <FormatQuoteIcon
                  sx={{
                    color: "rgba(255, 215, 0, 0.05)",
                    fontSize: 100,
                    position: "absolute",
                    top: 10,
                    right: 10,
                  }}
                />

                <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%", zIndex: 1 }}>
                  <Rating value={rev.rating} readOnly sx={{ mb: 2 }} />

                  <Typography
                    sx={{
                      color: "#cfcfcf",
                      fontStyle: "italic",
                      lineHeight: 1.8,
                      mb: 4,
                      flexGrow: 1,
                    }}
                  >
                    "{rev.comment}"
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: "auto" }}>
                    <Avatar
                      src={rev.avatar}
                      alt={rev.name}
                      sx={{ width: 60, height: 60, border: "2px solid #FFD700" }}
                    />
                    <Box>
                      <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>
                        {rev.name}
                      </Typography>
                      <Typography sx={{ color: "#a0a0a0", fontSize: 13 }}>
                        {rev.role}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
