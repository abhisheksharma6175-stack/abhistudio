"use client";

import { Box, Container, Grid, Typography, Paper } from "@mui/material";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import SpaIcon from "@mui/icons-material/Spa";
import StarIcon from "@mui/icons-material/Star";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const features = [
  {
    icon: <ContentCutIcon sx={{ fontSize: 40, color: "#FFD700" }} />,
    title: "Expert Stylists",
    description: "Our certified professionals have years of experience crafting customized hairstyles that match your unique personality and lifestyle.",
  },
  {
    icon: <SpaIcon sx={{ fontSize: 40, color: "#FFD700" }} />,
    title: "Premium Products",
    description: "We use only organic, clean, and premium-grade beauty and hair care brands to ensure maximum health and radiance for your skin and hair.",
  },
  {
    icon: <StarIcon sx={{ fontSize: 40, color: "#FFD700" }} />,
    title: "Luxury Experience",
    description: "Enjoy a relaxing, stress-free luxury salon environment designed to pamper you from the moment you step through our doors.",
  },
  {
    icon: <CalendarMonthIcon sx={{ fontSize: 40, color: "#FFD700" }} />,
    title: "Easy Online Booking",
    description: "Secure your salon service appointment in seconds with our user-friendly online booking platform and instant confirmation.",
  },
];

export default function WhyChooseUs() {
  return (
    <Box sx={{ py: 10, bgcolor: "#111", borderTop: "1px solid #2b2b2b" }}>
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
          WHY CHOOSE US
        </Typography>

        <Typography
          variant="h3"
          sx={{
            color: "#fff",
            textAlign: "center",
            fontWeight: 700,
            mb: 6,
            lineHeight: 1.2,
          }}
        >
          Elevating Your Personal Style
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature) => (
            <Grid key={feature.title} size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: "100%",
                  bgcolor: "#1b1b1b",
                  borderRadius: 4,
                  textAlign: "center",
                  border: "1px solid #2b2b2b",
                  transition: "all .3s ease",

                  "&:hover": {
                    transform: "translateY(-8px)",
                    borderColor: "#FFD700",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.4)",
                  },
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "rgba(255, 215, 0, 0.05)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid rgba(255, 215, 0, 0.15)",
                    }}
                  >
                    {feature.icon}
                  </Box>
                </Box>

                <Typography
                  variant="h5"
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    mb: 2,
                  }}
                >
                  {feature.title}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#a0a0a0",
                    lineHeight: 1.6,
                  }}
                >
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
