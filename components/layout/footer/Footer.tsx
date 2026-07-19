"use client";

import Link from "next/link";
import Image from "next/image";
import { Box, Container, Grid, Typography, IconButton, Divider } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import PinterestIcon from "@mui/icons-material/Pinterest";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";

export default function Footer() {
  return (
    <Box sx={{ bgcolor: "#000", color: "#fff", borderTop: "1px solid #2b2b2b", pt: 10, pb: 4 }}>
      <Container maxWidth="xl">
        <Grid container spacing={5}>
          {/* Column 1: About & Branding */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Link href="/" style={{ display: "inline-block", marginBottom: "20px" }}>
              <Image
                src="/images/logo.png"
                alt="Abhi Studio Logo"
                width={140}
                height={65}
                priority
              />
            </Link>

            <Typography variant="body2" sx={{ color: "#a0a0a0", lineHeight: 1.8, mb: 3, maxWidth: 320 }}>
              Abhi Studio is a premier luxury salon offering professional hair styling, skincare treatments, and premium beauty products. We empower you to feel and look your absolute best.
            </Typography>

            <Box sx={{ display: "flex", gap: 1 }}>
              {[
                { icon: <FacebookIcon />, url: "#" },
                { icon: <InstagramIcon />, url: "#" },
                { icon: <TwitterIcon />, url: "#" },
                { icon: <PinterestIcon />, url: "#" },
              ].map((social, idx) => (
                <IconButton
                  key={idx}
                  component="a"
                  href={social.url}
                  sx={{
                    color: "#FFD700",
                    border: "1px solid rgba(255, 215, 0, 0.2)",
                    transition: "all .3s ease",
                    "&:hover": {
                      bgcolor: "#FFD700",
                      color: "#000",
                      borderColor: "#FFD700",
                    },
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Column 2: Quick Links */}
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Typography variant="h6" sx={{ color: "#FFD700", fontWeight: 700, mb: 3 }}>
              Quick Links
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {[
                { title: "Home", href: "/" },
                { title: "Products Shop", href: "/products" },
                { title: "Salon Services", href: "/services" },
                { title: "About Our Salon", href: "/about" },
                { title: "Contact Us", href: "/contact" },
              ].map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  style={{
                    color: "#a0a0a0",
                    textDecoration: "none",
                    fontSize: "14px",
                    transition: "color .2s",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.color = "#FFD700")}
                  onMouseOut={(e) => (e.currentTarget.style.color = "#a0a0a0")}
                >
                  {link.title}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Column 3: Featured Services */}
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Typography variant="h6" sx={{ color: "#FFD700", fontWeight: 700, mb: 3 }}>
              Salon Services
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {[
                "Precision Haircut",
                "Balayage Coloring",
                "Hydrating Facial",
                "Gel Manicure",
                "Grooming & Shaving",
              ].map((svc) => (
                <Typography
                  key={svc}
                  sx={{
                    color: "#a0a0a0",
                    fontSize: "14px",
                    cursor: "pointer",
                    transition: "color .2s",
                    "&:hover": { color: "#FFD700" },
                  }}
                >
                  {svc}
                </Typography>
              ))}
            </Box>
          </Grid>

          {/* Column 4: Contact Info & Hours */}
          <Grid size={{ xs: 12, sm: 4, md: 4 }}>
            <Typography variant="h6" sx={{ color: "#FFD700", fontWeight: 700, mb: 3 }}>
              Get In Touch
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <LocationOnIcon sx={{ color: "#FFD700", fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: "#a0a0a0" }}>
                  123 Fashion Blvd, Suite 400, Styled City
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <PhoneIcon sx={{ color: "#FFD700", fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: "#a0a0a0" }}>
                  +1 (234) 567-8910
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <EmailIcon sx={{ color: "#FFD700", fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: "#a0a0a0" }}>
                  contact@abhistudio.com
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ borderColor: "#2b2b2b", my: 2 }} />

            <Typography variant="subtitle2" sx={{ color: "#fff", fontWeight: 600, mb: 0.5 }}>
              Hours of Operation:
            </Typography>
            <Typography variant="body2" sx={{ color: "#a0a0a0" }}>
              Mon - Sat: 9:00 AM - 8:00 PM <br />
              Sunday: 10:00 AM - 5:00 PM
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: "#2b2b2b", mt: 6, mb: 4 }} />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: "#606060", fontSize: 13 }}>
            &copy; {new Date().getFullYear()} Abhi Studio. All rights reserved.
          </Typography>

          <Box sx={{ display: "flex", gap: 3 }}>
            {["Privacy Policy", "Terms of Service", "Sitemap"].map((item) => (
              <Link
                key={item}
                href="#"
                style={{
                  color: "#606060",
                  textDecoration: "none",
                  fontSize: "13px",
                  transition: "color .2s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = "#a0a0a0")}
                onMouseOut={(e) => (e.currentTarget.style.color = "#606060")}
              >
                {item}
              </Link>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}