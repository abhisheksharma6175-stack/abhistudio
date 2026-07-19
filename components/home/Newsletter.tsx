"use client";

import { useState } from "react";
import { Box, Container, Typography, TextField, Button, Paper } from "@mui/material";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <Box sx={{ py: 10, bgcolor: "#1b1b1b", borderTop: "1px solid #2b2b2b" }}>
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 5, md: 8 },
            bgcolor: "#111",
            borderRadius: 6,
            border: "1px solid #2b2b2b",
            textAlign: "center",
            boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#FFD700",
              fontWeight: 600,
              mb: 1.5,
              letterSpacing: 2,
            }}
          >
            NEWSLETTER SIGNUP
          </Typography>

          <Typography
            variant="h3"
            sx={{
              color: "#fff",
              fontWeight: 700,
              mb: 2,
              lineHeight: 1.2,
            }}
          >
            Stay Ahead of Trends
          </Typography>

          <Typography
            sx={{
              color: "#a0a0a0",
              fontSize: 16,
              mb: 4,
              maxWidth: 550,
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            Subscribe to our newsletter to receive styling tips, skincare routines, notifications about product releases, and exclusive salon discounts.
          </Typography>

          {subscribed ? (
            <Box
              sx={{
                p: 2,
                bgcolor: "rgba(255,215,0,0.1)",
                color: "#FFD700",
                borderRadius: 2,
                fontWeight: 600,
                border: "1px solid rgba(255,215,0,0.2)",
              }}
            >
              🎉 Thank you for subscribing! Check your inbox soon for updates.
            </Box>
          ) : (
            <Box
              component="form"
              onSubmit={handleSubscribe}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                justifyContent: "center",
                maxWidth: 500,
                mx: "auto",
              }}
            >
              <TextField
                required
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    bgcolor: "#1b1b1b",
                    borderRadius: "30px",
                    px: 1,
                    "& fieldset": { borderColor: "#2b2b2b" },
                    "&:hover fieldset": { borderColor: "#FFD700" },
                    "&.Mui-focused fieldset": { borderColor: "#FFD700" },
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                sx={{
                  bgcolor: "#FFD700",
                  color: "#000",
                  fontWeight: 600,
                  px: 4,
                  py: { xs: 1.5, sm: 0 },
                  borderRadius: "30px",
                  whiteSpace: "nowrap",

                  "&:hover": {
                    bgcolor: "#e6c200",
                  },
                }}
              >
                Subscribe
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
