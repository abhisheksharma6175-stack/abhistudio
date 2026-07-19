"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Button,
  IconButton,
  Badge,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { getCart } from "@/lib/cart";

const menuItems = [
  { title: "Home", href: "/" },
  { title: "Products", href: "/products" },
  { title: "Services", href: "/services" },
  { title: "About", href: "/about" },
  { title: "Contact", href: "/contact" },
];

export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<{ name: string | null; role: string } | null>(null);

  useEffect(() => {
    // Load initial count on client mount
    if (typeof window !== "undefined") {
      setCartCount(getCart().reduce((total, item) => total + item.quantity, 0));
    }

    const handleCartUpdate = () => {
      setCartCount(getCart().reduce((total, item) => total + item.quantity, 0));
    };

    window.addEventListener("storage", handleCartUpdate);
    window.addEventListener("cart-updated", handleCartUpdate);
    fetch("/api/auth/me").then((response) => response.json()).then((data) => setUser(data.user)).catch(() => undefined);
    return () => {
      window.removeEventListener("storage", handleCartUpdate);
      window.removeEventListener("cart-updated", handleCartUpdate);
    };
  }, []);

  return (
    <AppBar
  position="sticky"
  elevation={0}
  sx={{
    bgcolor: "#000",
    color: "#fff",
    borderBottom: "1px solid #2b2b2b",
  }}
>
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            height: 80,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}

          <Link href="/" style={{ display: "flex", alignItems: "center" }}>
            <Image
              src="/images/logo.png"
              alt="Abhi Studio"
              width={130}
              height={60}
              priority
            />
          </Link>

          {/* Navigation */}

          <Box
            sx={{
              display: {
                xs: "none",
                md: "flex",
              },
              gap: 4,
            }}
          >
            {menuItems.map((item) => (
              <Button
                key={item.title}
                component={Link}
                href={item.href}
                sx={{
                  color: "#FFD700",
                  fontWeight: 400,
                  textTransform: "none",
                  fontSize: "15px",

                  "&:hover": {
                    color: "#FFD700",
                    background: "transparent",
                  },
                }}
              >
                {item.title}
              </Button>
            ))}
          </Box>

          {/* Right Side */}

          <Box
  sx={{
    display: "flex",
    alignItems: "center",
  }}
>
           <IconButton
  sx={{
    color: "#FFD700",
    "&:hover": {
      backgroundColor: "rgba(255, 215, 0, 0.08)",
    },
  }}
>
  <SearchIcon />
</IconButton>

<IconButton
  sx={{
    color: "#FFD700",
    "&:hover": {
      backgroundColor: "rgba(255, 215, 0, 0.08)",
    },
  }}
>
  <FavoriteBorderIcon />
</IconButton>

<IconButton
  component={Link}
  href="/cart"
  sx={{
    color: "#FFD700",
    "&:hover": {
      backgroundColor: "rgba(255, 215, 0, 0.08)",
    },
  }}
>
  <Badge
    badgeContent={cartCount}
    sx={{
      "& .MuiBadge-badge": {
        backgroundColor: "#FFD700",
        color: "#000",
      },
    }}
  >
    <ShoppingBagOutlinedIcon />
  </Badge>
</IconButton>
            <Button component={Link} href={user?.role === "ADMIN" ? "/admin" : "/login"}
  variant="contained"
  startIcon={<PersonOutlineOutlinedIcon />}
  sx={{
    ml: 2,
    px: 3,
    py: 1,
    borderRadius: "30px",

    backgroundColor: "#FFD700",
    color: "#000",

    fontWeight: 600,
    textTransform: "uppercase",

    "&:hover": {
      backgroundColor: "#E6C200",
    },
  }}
>
  {user?.role === "ADMIN" ? "Admin" : user ? user.name || "Account" : "Login"}
</Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
