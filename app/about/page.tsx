"use client";

import Image from "next/image";
import Link from "next/link";
import { Box, Container, Grid, Typography, Card, CardContent, Button } from "@mui/material";

const team = [
  {
    name: "Sarah Connor",
    role: "Founder & Master Hair Stylist",
    bio: "Sarah has over 12 years of experience styling for fashion runways and celebrity clients. She specializes in balayage and corrective hair design.",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop",
  },
  {
    name: "Michael Chen",
    role: "Lead Skincare Specialist",
    bio: "Michael holds a doctorate in cosmetology and has dedicated his career to clean, restorative facials and personalized skin wellness treatments.",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
  },
  {
    name: "Aria Thorne",
    role: "Senior Nail & Color Artist",
    bio: "Aria is known for her creative nail art and gel nail health solutions. Her designs focus on luxury patterns and nourishing therapies.",
    imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop",
  },
];

export default function AboutPage() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#111", pb: 10 }}>
      {/* Banner */}
      <Box
        sx={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 100%), url("https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1200&auto=format&fit=crop")',
          backgroundPosition: "center 20%",
          backgroundSize: "cover",
          height: 250,
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid #2b2b2b",
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="h2" sx={{ color: "#fff", fontWeight: 700, mb: 1 }}>
            Our Story
          </Typography>
          <Typography sx={{ color: "#FFD700", fontSize: 18, fontWeight: 500 }}>
            Luxury Experience & Artistic Self-Care Since 2018
          </Typography>
        </Container>
      </Box>

      {/* Philosophy Section */}
      <Container maxWidth="xl" sx={{ mt: 8 }}>
        <Grid container spacing={8} sx={{ alignItems: "center", mb: 12 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" sx={{ color: "#FFD700", fontWeight: 600, mb: 2, letterSpacing: 2 }}>
              OUR PHILOSOPHY
            </Typography>
            <Typography variant="h3" sx={{ color: "#fff", fontWeight: 700, mb: 3, lineHeight: 1.2 }}>
              Redefining Salon Self-Care
            </Typography>
            <Typography sx={{ color: "#cfcfcf", fontSize: 16, lineHeight: 1.8, mb: 3 }}>
              At Abhi Studio, we believe self-care is an art form. We designed our salon to be a sanctuary where customers can disconnect from daily stressors and invest in premium wellness treatments tailored precisely to their natural features.
            </Typography>
            <Typography sx={{ color: "#a0a0a0", fontSize: 16, lineHeight: 1.8, mb: 4 }}>
              From using entirely organic, vegan-friendly product formulas to ongoing training of our artistic styling team, our mission is to deliver professional hair styling, skincare therapy, and nail art that brings out your inner confidence.
            </Typography>

            <Button
              component={Link}
              href="/services"
              variant="contained"
              sx={{
                bgcolor: "#FFD700",
                color: "#000",
                fontWeight: 600,
                borderRadius: "30px",
                px: 4,
                py: 1.5,
                "&:hover": { bgcolor: "#e6c200" },
              }}
            >
              Explore Services
            </Button>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                position: "relative",
                height: 450,
                borderRadius: 6,
                overflow: "hidden",
                border: "1px solid #2b2b2b",
              }}
            >
              <Image
                src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800&auto=format&fit=crop"
                alt="Salon atmosphere"
                fill
                style={{ objectFit: "cover" }}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Team Section */}
        <Box sx={{ borderTop: "1px solid #2b2b2b", pt: 10 }}>
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
            THE EXPERT TEAM
          </Typography>

          <Typography
            variant="h3"
            sx={{
              color: "#fff",
              textAlign: "center",
              fontWeight: 700,
              mb: 8,
            }}
          >
            Meet Our Artistic Stylists
          </Typography>

          <Grid container spacing={4}>
            {team.map((member, index) => (
              <Grid key={index} size={{ xs: 12, md: 4 }}>
                <Card
                  sx={{
                    bgcolor: "#1b1b1b",
                    borderRadius: 4,
                    border: "1px solid #2b2b2b",
                    height: "100%",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all .3s ease",

                    "&:hover": {
                      borderColor: "#FFD700",
                      transform: "translateY(-8px)",
                    },
                  }}
                >
                  <Box sx={{ position: "relative", height: 320, width: "100%" }}>
                    <Image
                      src={member.imageUrl}
                      alt={member.name}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </Box>

                  <CardContent sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                    <Typography variant="h5" sx={{ color: "#fff", fontWeight: 700, mb: 0.5 }}>
                      {member.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#FFD700", fontWeight: 600, mb: 2 }}>
                      {member.role}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#a0a0a0", lineHeight: 1.7 }}>
                      {member.bio}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
