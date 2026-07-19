"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  MenuItem,
  Card,
  CardContent,
  Button,
  Rating,
  List,
  ListItemText,
  ListItemButton,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { addToCart } from "@/lib/cart";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: {
    name: string;
    slug: string;
  };
}

const categories = [
  { name: "All Products", slug: "all" },
  { name: "Hair Care", slug: "hair-care" },
  { name: "Skin Care", slug: "skin-care" },
  { name: "Hair Styling", slug: "hair-styling" },
  { name: "Nail Care", slug: "nail-care" },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load products:", err);
        setLoading(false);
      });
  }, []);

  // Filter & Search Logic
  useEffect(() => {
    let result = [...products];

    // Filter by Category
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category?.slug === selectedCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // Sorting
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredProducts(result);
  }, [products, selectedCategory, searchQuery, sortBy]);

  const handleAddToCart = (product: Product) => {
    addToCart({ id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl });
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#111", pb: 10 }}>
      {/* Banner */}
      <Box
        sx={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 100%), url("https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1200&auto=format&fit=crop")',
          backgroundPosition: "center 30%",
          backgroundSize: "cover",
          height: 250,
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid #2b2b2b",
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="h2" sx={{ color: "#fff", fontWeight: 700, mb: 1 }}>
            Premium Shop
          </Typography>
          <Typography sx={{ color: "#FFD700", fontSize: 18, fontWeight: 500 }}>
            Luxury Hair Care & Premium Skincare Formulas
          </Typography>
        </Container>
      </Box>

      {/* Main Shop Section */}
      <Container maxWidth="xl" sx={{ mt: 6 }}>
        <Grid container spacing={4}>
          {/* Left: Sidebar Filters */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Box
              sx={{
                p: 3,
                bgcolor: "#1b1b1b",
                borderRadius: 4,
                border: "1px solid #2b2b2b",
                position: "sticky",
                top: 100,
              }}
            >
              <Typography variant="h6" sx={{ color: "#FFD700", fontWeight: 700, mb: 2 }}>
                Categories
              </Typography>

              <List sx={{ p: 0 }}>
                {categories.map((cat) => (
                  <ListItemButton
                    key={cat.slug}
                    onClick={() => setSelectedCategory(cat.slug)}
                    selected={selectedCategory === cat.slug}
                    sx={{
                      borderRadius: 2,
                      mb: 0.5,
                      color: selectedCategory === cat.slug ? "#FFD700" : "#cfcfcf",
                      bgcolor: selectedCategory === cat.slug ? "rgba(255, 215, 0, 0.08)" : "transparent",
                      "&.Mui-selected": {
                        bgcolor: "rgba(255, 215, 0, 0.12)",
                        "&:hover": { bgcolor: "rgba(255, 215, 0, 0.15)" },
                      },
                      "&:hover": {
                        color: "#FFD700",
                        bgcolor: "rgba(255, 215, 0, 0.04)",
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography sx={{ fontWeight: selectedCategory === cat.slug ? 600 : 400 }}>
                          {cat.name}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                ))}
              </List>
            </Box>
          </Grid>

          {/* Right: Products Grid */}
          <Grid size={{ xs: 12, md: 9 }}>
            {/* Search and Sort Toolbar */}
            <Box
              sx={{
                p: 2,
                bgcolor: "#1b1b1b",
                borderRadius: 4,
                border: "1px solid #2b2b2b",
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
                mb: 4,
              }}
            >
              <TextField
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="outlined"
                size="small"
                sx={{
                  width: { xs: "100%", sm: 300 },
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    bgcolor: "#111",
                    borderRadius: "30px",
                    "& fieldset": { borderColor: "#2b2b2b" },
                    "&:hover fieldset": { borderColor: "#FFD700" },
                    "&.Mui-focused fieldset": { borderColor: "#FFD700" },
                  },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "#a0a0a0" }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: { xs: "100%", sm: "auto" } }}>
                <Typography sx={{ color: "#a0a0a0", fontSize: 14, whiteSpace: "nowrap" }}>
                  Sort By:
                </Typography>
                <TextField
                  select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{
                    width: 180,
                    "& .MuiOutlinedInput-root": {
                      color: "#fff",
                      bgcolor: "#111",
                      borderRadius: "30px",
                      "& fieldset": { borderColor: "#2b2b2b" },
                      "&:hover fieldset": { borderColor: "#FFD700" },
                      "&.Mui-focused fieldset": { borderColor: "#FFD700" },
                    },
                  }}
                >
                  <MenuItem value="default">Featured</MenuItem>
                  <MenuItem value="price-low">Price: Low to High</MenuItem>
                  <MenuItem value="price-high">Price: High to Low</MenuItem>
                  <MenuItem value="name-asc">Name: A to Z</MenuItem>
                </TextField>
              </Box>
            </Box>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
                <CircularProgress sx={{ color: "#FFD700" }} />
              </Box>
            ) : filteredProducts.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 10 }}>
                <Typography variant="h5" sx={{ color: "#a0a0a0", mb: 2 }}>
                  No products found.
                </Typography>
                <Typography sx={{ color: "#606060" }}>
                  Try adjusting your keywords or category filters.
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {filteredProducts.map((prod) => (
                  <Grid key={prod.id} size={{ xs: 12, sm: 6, md: 4 }}>
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
                      <Box
                        sx={{
                          position: "absolute",
                          top: 12,
                          right: 12,
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

                      <Box sx={{ position: "relative", height: 240, width: "100%" }}>
                        <Image
                          src={prod.imageUrl}
                          alt={prod.name}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </Box>

                      <CardContent
                        sx={{
                          p: 3,
                          flexGrow: 1,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{ color: "#FFD700", fontWeight: 600, mb: 0.5, textTransform: "uppercase" }}
                        >
                          {prod.category?.name || "Product"}
                        </Typography>

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

                        <Typography
                          variant="body2"
                          sx={{
                            color: "#a0a0a0",
                            lineHeight: 1.6,
                            mb: 3,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {prod.description}
                        </Typography>

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
                            onClick={() => handleAddToCart(prod)}
                            variant="contained"
                            sx={{
                              bgcolor: "#FFD700",
                              color: "#000",
                              borderRadius: "30px",
                              px: 3,
                              py: 1,
                              fontWeight: 600,
                              textTransform: "none",
                              display: "flex",
                              gap: 1,

                              "&:hover": {
                                bgcolor: "#e6c200",
                              },
                            }}
                          >
                            <ShoppingCartOutlinedIcon fontSize="small" />
                            Add
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
