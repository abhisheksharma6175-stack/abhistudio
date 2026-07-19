"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Box, Container, Grid, Typography, Card, CardContent, Button, Chip } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  imageUrl?: string;
}

const mockServices: Service[] = [
  {
    id: "svc1",
    name: "Signature Precision Haircut",
    description: "A customized haircut experience including professional styling consultation, relaxing shampoo wash, precision trim, and blowout styling.",
    price: 45,
    duration: 45,
    imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "svc2",
    name: "Balayage Artistry Hair Color",
    description: "Hand-painted premium highlights that blend seamlessly with your natural hair, creating a soft, sun-kissed, dimension-rich color look.",
    price: 145,
    duration: 120,
    imageUrl: "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "svc3",
    name: "Oxygenating Hydrating Facial",
    description: "A luxurious deep-cleansing facial therapy utilizing custom fruit enzyme masks, deep pore extractions, soothing massage, and oxygen hydration.",
    price: 75,
    duration: 60,
    imageUrl: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "svc4",
    name: "Nourishing Gel Manicure",
    description: "Detailed nail shaping, cuticle therapy, therapeutic hand massage, and long-lasting non-toxic gel polish set under UV light.",
    price: 35,
    duration: 40,
    imageUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=600&auto=format&fit=crop",
  },
];

export default function Services() {
  const [services, setServices] = useState<Service[]>(mockServices);

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          setServices(data.slice(0, 4));
        }
      })
      .catch((err) => console.log("Failed to fetch services, using mock data", err));
  }, []);

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
          OUR PREMIUM SERVICES
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
          Salon Treatments & Styling
        </Typography>

        <Grid container spacing={4}>
          {services.map((svc) => (
            <Grid key={svc.id} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card
                sx={{
                  bgcolor: "#111",
                  borderRadius: 4,
                  overflow: "hidden",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid #2b2b2b",
                  transition: "all .3s ease",

                  "&:hover": {
                    transform: "translateY(-8px)",
                    borderColor: "#FFD700",
                  },
                }}
              >
                <Box sx={{ position: "relative", height: 220, width: "100%" }}>
                  <Image
                    src={svc.imageUrl || "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=600&auto=format&fit=crop"}
                    alt={svc.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      bgcolor: "rgba(0,0,0,0.85)",
                      borderRadius: 2,
                      px: 1.5,
                      py: 0.5,
                      border: "1px solid #FFD700",
                    }}
                  >
                    <Typography sx={{ color: "#FFD700", fontWeight: 700 }}>
                      ${svc.price.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>

                <CardContent sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                  <Typography
                    variant="h5"
                    sx={{
                      color: "#fff",
                      fontWeight: 700,
                      mb: 1.5,
                      minHeight: 56,
                      lineHeight: 1.2,
                    }}
                  >
                    {svc.name}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <AccessTimeIcon sx={{ color: "#a0a0a0", fontSize: 16 }} />
                    <Typography variant="body2" sx={{ color: "#a0a0a0" }}>
                      {svc.duration} mins
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "#cfcfcf",
                      lineHeight: 1.6,
                      mb: 3,
                      flexGrow: 1,
                    }}
                  >
                    {svc.description.length > 100
                      ? `${svc.description.substring(0, 100)}...`
                      : svc.description}
                  </Typography>

                  <Button
                    component={Link}
                    href={`/services?book=${svc.id}`}
                    variant="contained"
                    fullWidth
                    sx={{
                      bgcolor: "#FFD700",
                      color: "#000",
                      fontWeight: 600,
                      borderRadius: "30px",
                      py: 1,
                      mt: "auto",

                      "&:hover": {
                        bgcolor: "#e6c200",
                      },
                    }}
                  >
                    Book Appointment
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
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
              fontWeight: 600,

              "&:hover": {
                borderColor: "#FFD700",
                bgcolor: "rgba(255, 215, 0, 0.05)",
              },
            }}
          >
            View All Services
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
