"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Box, Container, Grid, Typography, Card, CardContent, Button, Rating, IconButton } from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

const mockProducts: Product[] = [
  {
    id: "prod1",
    name: "Premium Argan Oil Shampoo",
    description: "Hydrating and restoring shampoo enriched with pure Moroccan argan oil. Restores dry, damaged hair by locking in natural moisture.",
    price: 24.99,
    imageUrl: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "prod2",
    name: "Keratin Nourishing Repair Conditioner",
    description: "Deeply conditions and strengthens hair strands, repairing damage caused by styling heat and color treatments.",
    price: 19.99,
    imageUrl: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "prod3",
    name: "Hydrating Hyaluronic Face Serum",
    description: "Moisture-boosting facial serum with 2% hyaluronic acid and Vitamin B5. Restores plumpness and glow for a youthful complexion.",
    price: 34.99,
    imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "prod4",
    name: "Gentle Foaming Cleanser",
    description: "pH-balanced foaming facial cleanser that melts away makeup, excess oil, and impurities without stripping natural skin oils.",
    price: 15.99,
    imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600&auto=format&fit=crop",
  },
];

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>(mockProducts);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          setProducts(data.slice(0, 4));
        }
      })
      .catch((err) => console.log("Failed to fetch products, using mock data", err));
  }, []);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    // Dispatch cart update event or local storage update
    const currentCount = parseInt(localStorage.getItem("cartCount") || "0") + 1;
    localStorage.setItem("cartCount", currentCount.toString());
    window.dispatchEvent(new Event("storage"));
  };

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
          OUR FEATURED PRODUCTS
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
          Premium Beauty & Salon Products
        </Typography>

        <Grid container spacing={4}>
          {products.map((prod) => (
            <Grid key={prod.id} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card
                sx={{
                  bgcolor: "#1b1b1b",
                  borderRadius: 4,
                  overflow: "hidden",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid #2b2b2b",
                  position: "relative",
                  transition: "all .3s ease",

                  "&:hover": {
                    transform: "translateY(-8px)",
                    borderColor: "#FFD700",
                  },
                }}
              >
                {/* Actions */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    zIndex: 2,
                  }}
                >
                  <IconButton
                    sx={{
                      bgcolor: "rgba(0,0,0,0.7)",
                      color: "#fff",
                      "&:hover": { bgcolor: "#FFD700", color: "#000" },
                    }}
                  >
                    <FavoriteBorderIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Box sx={{ position: "relative", height: 260, width: "100%" }}>
                  <Image
                    src={prod.imageUrl}
                    alt={prod.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </Box>

                <CardContent sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#fff",
                      fontWeight: 700,
                      mb: 1,
                      minHeight: 56,
                      lineHeight: 1.3,
                    }}
                  >
                    {prod.name}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <Rating value={5} readOnly size="small" />
                    <Typography variant="body2" sx={{ color: "#a0a0a0" }}>
                      (5.0)
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mt: "auto",
                    }}
                  >
                    <Typography variant="h5" sx={{ color: "#FFD700", fontWeight: 700 }}>
                      ${prod.price.toFixed(2)}
                    </Typography>

                    <Button
                      onClick={handleAddToCart}
                      variant="contained"
                      sx={{
                        bgcolor: "#FFD700",
                        color: "#000",
                        minWidth: "auto",
                        borderRadius: "50%",
                        p: 1.5,

                        "&:hover": {
                          bgcolor: "#e6c200",
                        },
                      }}
                    >
                      <ShoppingCartOutlinedIcon fontSize="small" />
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
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
            Shop All Products
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
