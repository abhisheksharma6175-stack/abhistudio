"use client";

import Image from "next/image";
import Link from "next/link";

import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardActionArea,
} from "@mui/material";

const categories = [
  {
    title: "Shampoo",
    image: "/images/categories/shampoo.png",
    href: "/products?category=shampoo",
  },
  {
    title: "Conditioner",
    image: "/images/categories/Conditioner.png",
    href: "/products?category=conditioner",
  },
  {
    title: "Hair Oil",
    image: "/images/categories/hairy-oil.png",
    href: "/products?category=hair-oil",
  },
  {
    title: "Styling",
    image: "/images/categories/styling.png",
    href: "/products?category=styling",
  },
  {
    title: "Beard Care",
    image: "/images/categories/Beard.png",
    href: "/products?category=beard",
  },
  {
    title: "Treatment",
    image: "/images/categories/Hair-treatment.png",
    href: "/products?category=treatment",
  },
];

export default function Categories() {
  return (
    <Box
      sx={{
        py: 10,
        bgcolor: "#111",
      }}
    >
      <Container maxWidth="xl">
        <Typography
          variant="h6"
          sx={{
            color: "#FFD700",
            fontWeight: 600,
            textAlign: "center",
            mb: 1,
          }}
        >
          SHOP BY CATEGORY
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
          Premium Hair Care Collection
        </Typography>

        <Grid container spacing={4}>
          {categories.map((category) => (
            <Grid key={category.title} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  bgcolor: "#1b1b1b",
                  borderRadius: 4,
                  overflow: "hidden",
                  transition: ".3s",

                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 15px 35px rgba(255,215,0,.2)",
                  },
                }}
              >
                <CardActionArea component={Link} href={category.href}>
                  <Box
                    sx={{
                      position: "relative",
                      height: 300,
                    }}
                  >
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      style={{
                        objectFit: "cover",
                      }}
                    />
                  </Box>

                  <Box sx={{ py: 3 }}>
                    <Typography
                      variant="h5"
                      align="center"
                      sx={{
                        color: "#FFD700",
                        fontWeight: 700,
                      }}
                    >
                      {category.title}
                    </Typography>
                  </Box>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
