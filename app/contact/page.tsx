"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Snackbar,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }, 1200);
  };

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
            Contact Us
          </Typography>
          <Typography sx={{ color: "#FFD700", fontSize: 18, fontWeight: 500 }}>
            Get in Touch to Customize Your Style & Beauty Service
          </Typography>
        </Container>
      </Box>

      {/* Contact Main Section */}
      <Container maxWidth="xl" sx={{ mt: 8 }}>
        <Grid container spacing={6}>
          {/* Left: Contact Info */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography variant="h6" sx={{ color: "#FFD700", fontWeight: 600, mb: 2, letterSpacing: 2 }}>
              CONTACT DETAILS
            </Typography>
            <Typography variant="h3" sx={{ color: "#fff", fontWeight: 700, mb: 4 }}>
              Visit Abhi Studio
            </Typography>
            <Typography sx={{ color: "#cfcfcf", fontSize: 16, lineHeight: 1.8, mb: 5 }}>
              Have questions about our salon services, premium hair products, or wholesale collaborations? Get in touch with our support desk or schedule a visit directly.
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 4, mb: 5 }}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2.5 }}>
                <Box sx={{ p: 1.5, bgcolor: "rgba(255,215,0,0.05)", borderRadius: "50%", border: "1px solid rgba(255,215,0,0.15)" }}>
                  <LocationOnIcon sx={{ color: "#FFD700", fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700, mb: 0.5 }}>
                    Our Location
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#a0a0a0" }}>
                    123 Fashion Blvd, Suite 400, Styled City
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2.5 }}>
                <Box sx={{ p: 1.5, bgcolor: "rgba(255,215,0,0.05)", borderRadius: "50%", border: "1px solid rgba(255,215,0,0.15)" }}>
                  <PhoneIcon sx={{ color: "#FFD700", fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700, mb: 0.5 }}>
                    Phone Number
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#a0a0a0" }}>
                    +1 (234) 567-8910
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2.5 }}>
                <Box sx={{ p: 1.5, bgcolor: "rgba(255,215,0,0.05)", borderRadius: "50%", border: "1px solid rgba(255,215,0,0.15)" }}>
                  <EmailIcon sx={{ color: "#FFD700", fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700, mb: 0.5 }}>
                    Support Email
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#a0a0a0" }}>
                    contact@abhistudio.com
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2.5 }}>
                <Box sx={{ p: 1.5, bgcolor: "rgba(255,215,0,0.05)", borderRadius: "50%", border: "1px solid rgba(255,215,0,0.15)" }}>
                  <AccessTimeIcon sx={{ color: "#FFD700", fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700, mb: 0.5 }}>
                    Salon Hours
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#a0a0a0" }}>
                    Monday - Saturday: 9:00 AM - 8:00 PM <br />
                    Sunday: 10:00 AM - 5:00 PM
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Right: Contact Form */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper
              elevation={0}
              sx={{
                p: 5,
                bgcolor: "#1b1b1b",
                borderRadius: 4,
                border: "1px solid #2b2b2b",
                boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
              }}
            >
              <Typography variant="h5" sx={{ color: "#fff", fontWeight: 700, mb: 4 }}>
                Send Us a Message
              </Typography>

              <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      required
                      label="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      fullWidth
                      variant="outlined"
                      slotProps={{
                        inputLabel: { sx: { color: "#a0a0a0" } },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          color: "#fff",
                          "& fieldset": { borderColor: "#2b2b2b" },
                          "&:hover fieldset": { borderColor: "#FFD700" },
                          "&.Mui-focused fieldset": { borderColor: "#FFD700" },
                        },
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      required
                      type="email"
                      label="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      fullWidth
                      variant="outlined"
                      slotProps={{
                        inputLabel: { sx: { color: "#a0a0a0" } },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          color: "#fff",
                          "& fieldset": { borderColor: "#2b2b2b" },
                          "&:hover fieldset": { borderColor: "#FFD700" },
                          "&.Mui-focused fieldset": { borderColor: "#FFD700" },
                        },
                      }}
                    />
                  </Grid>
                </Grid>

                <TextField
                  required
                  label="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  fullWidth
                  variant="outlined"
                  slotProps={{
                    inputLabel: { sx: { color: "#a0a0a0" } },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#fff",
                      "& fieldset": { borderColor: "#2b2b2b" },
                      "&:hover fieldset": { borderColor: "#FFD700" },
                      "&.Mui-focused fieldset": { borderColor: "#FFD700" },
                    },
                  }}
                />

                <TextField
                  required
                  label="Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  fullWidth
                  multiline
                  rows={5}
                  variant="outlined"
                  slotProps={{
                    inputLabel: { sx: { color: "#a0a0a0" } },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#fff",
                      "& fieldset": { borderColor: "#2b2b2b" },
                      "&:hover fieldset": { borderColor: "#FFD700" },
                      "&.Mui-focused fieldset": { borderColor: "#FFD700" },
                    },
                  }}
                />

                <Button
                  type="submit"
                  disabled={submitting}
                  variant="contained"
                  sx={{
                    bgcolor: "#FFD700",
                    color: "#000",
                    fontWeight: 600,
                    py: 1.5,
                    borderRadius: "30px",
                    alignSelf: "flex-start",
                    px: 5,
                    "&:hover": { bgcolor: "#e6c200" },
                  }}
                >
                  {submitting ? "Sending..." : "Send Message"}
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Snackbar Confirmation */}
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="success" sx={{ width: "100%", bgcolor: "#FFD700", color: "#000", fontWeight: 600 }}>
          🎉 Thank you! Your message has been sent successfully. We will get back to you shortly.
        </Alert>
      </Snackbar>
    </Box>
  );
}
