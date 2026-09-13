"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  Snackbar,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  imageUrl?: string;
  category: {
    name: string;
    slug: string;
  };
}

const stylists = [
  { id: "any", name: "Any Available Stylist" },
  { id: "stylist1", name: "Sarah Connor (Hair Stylist)" },
  { id: "stylist2", name: "Michael Chen (Skin Specialist)" },
];

function ServicesContent() {
  const searchParams = useSearchParams();
  const bookQueryParam = searchParams.get("book");

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Booking Dialog State
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  
  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [stylist, setStylist] = useState("any");
  const [notes, setNotes] = useState("");
  
  // Form Status
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        setServices(data);
        setLoading(false);
        
        // If a ?book=ID query parameter is present, automatically open the modal for that service
        if (bookQueryParam) {
          const serviceToBook = data.find((s: Service) => s.id === bookQueryParam);
          if (serviceToBook) {
            setSelectedService(serviceToBook);
            setBookingOpen(true);
          }
        }
      })
      .catch((err) => {
        console.error("Failed to fetch services:", err);
        setLoading(false);
      });
  }, [bookQueryParam]);

  const handleOpenBooking = (service: Service) => {
    setSelectedService(service);
    setBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setBookingOpen(false);
    setSelectedService(null);
    setErrorMsg("");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !date || !time) return;

    setSubmitting(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          serviceId: selectedService.id,
          dateTime: `${date}T${time}:00`,
          notes,
          stylistId: stylist === "any" ? null : stylist,
        }),
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        setSuccessMsg(resData.message || "Your appointment has been successfully scheduled!");
        setSnackbarOpen(true);
        handleCloseBooking();
        // Reset form
        setName("");
        setEmail("");
        setPhone("");
        setDate("");
        setTime("");
        setStylist("any");
        setNotes("");
      } else {
        setErrorMsg(resData.error || "Failed to submit booking. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("A connection error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Group services by category
  const categoriesMap = services.reduce((acc, svc) => {
    const catName = svc.category?.name || "Other Services";
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(svc);
    return acc;
  }, {} as Record<string, Service[]>);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#111", pb: 10 }}>
      {/* Banner */}
      <Box
        sx={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 100%), url("https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1200&auto=format&fit=crop")',
          backgroundPosition: "center 40%",
          backgroundSize: "cover",
          height: 250,
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid #2b2b2b",
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="h2" sx={{ color: "#fff", fontWeight: 700, mb: 1 }}>
            Salon Services
          </Typography>
          <Typography sx={{ color: "#FFD700", fontSize: 18, fontWeight: 500 }}>
            Luxury Treatments, Styling, and Nail Artistry by Experts
          </Typography>
        </Container>
      </Box>

      {/* Services Listings */}
      <Container maxWidth="xl" sx={{ mt: 8 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress sx={{ color: "#FFD700" }} />
          </Box>
        ) : Object.keys(categoriesMap).length === 0 ? (
          <Typography sx={{ color: "#a0a0a0", textAlign: "center", py: 8 }}>
            No salon services currently available.
          </Typography>
        ) : (
          Object.entries(categoriesMap).map(([categoryName, categoryServices]) => (
            <Box key={categoryName} sx={{ mb: 8 }}>
              <Typography
                variant="h4"
                sx={{
                  color: "#FFD700",
                  fontWeight: 700,
                  mb: 4,
                  pb: 1.5,
                  borderBottom: "2px solid #2b2b2b",
                  display: "inline-block",
                }}
              >
                {categoryName}
              </Typography>

              <Grid container spacing={4}>
                {categoryServices.map((svc) => (
                  <Grid key={svc.id} size={{ xs: 12, md: 6 }}>
                    <Card
                      sx={{
                        bgcolor: "#1b1b1b",
                        borderRadius: 4,
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        border: "1px solid #2b2b2b",
                        overflow: "hidden",
                        height: "100%",
                        transition: "all .3s ease",

                        "&:hover": {
                          borderColor: "#FFD700",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          position: "relative",
                          width: { xs: "100%", sm: 220 },
                          height: { xs: 200, sm: "auto" },
                        }}
                      >
                        <Image
                          src={svc.imageUrl || "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=600&auto=format&fit=crop"}
                          alt={svc.name}
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
                          justifyContent: "space-between",
                        }}
                      >
                        <Box>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2, mb: 1 }}>
                            <Typography variant="h5" sx={{ color: "#fff", fontWeight: 700, lineHeight: 1.2 }}>
                              {svc.name}
                            </Typography>
                            <Typography variant="h5" sx={{ color: "#FFD700", fontWeight: 700, whiteSpace: "nowrap" }}>
                              ${svc.price.toFixed(2)}
                            </Typography>
                          </Box>

                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                            <AccessTimeIcon sx={{ color: "#a0a0a0", fontSize: 16 }} />
                            <Typography variant="body2" sx={{ color: "#a0a0a0" }}>
                              {svc.duration} mins
                            </Typography>
                          </Box>

                          <Typography variant="body2" sx={{ color: "#cfcfcf", lineHeight: 1.6, mb: 3 }}>
                            {svc.description}
                          </Typography>
                        </Box>

                        <Button
                          onClick={() => handleOpenBooking(svc)}
                          variant="contained"
                          sx={{
                            bgcolor: "#FFD700",
                            color: "#000",
                            fontWeight: 600,
                            borderRadius: "30px",
                            px: 4,
                            alignSelf: "flex-start",
                            "&:hover": { bgcolor: "#e6c200" },
                          }}
                        >
                          Book Appointment
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))
        )}
      </Container>

      {/* Booking Dialog Modal */}
      <Dialog
        open={bookingOpen}
        onClose={handleCloseBooking}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: {
              bgcolor: "#1b1b1b",
              color: "#fff",
              borderRadius: 4,
              border: "1px solid #2b2b2b",
            },
          },
        }}
      >
        <Box component="form" onSubmit={handleFormSubmit}>
          <DialogTitle sx={{ borderBottom: "1px solid #2b2b2b", pb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#fff" }}>
              Book {selectedService?.name}
            </Typography>
            <Typography variant="body2" sx={{ color: "#FFD700", mt: 0.5 }}>
              Price: ${selectedService?.price.toFixed(2)} | Duration: {selectedService?.duration} mins
            </Typography>
          </DialogTitle>

          <DialogContent sx={{ pt: 3 }}>
            {errorMsg && (
              <Alert severity="error" sx={{ mb: 3, bgcolor: "rgba(211, 47, 47, 0.1)", color: "#f44336" }}>
                {errorMsg}
              </Alert>
            )}

            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
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

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
                  type="date"
                  label="Preferred Date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  fullWidth
                  variant="outlined"
                  slotProps={{
                    inputLabel: { shrink: true, sx: { color: "#a0a0a0" } },
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
                  select
                  label="Preferred Time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
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
                >
                  {["09:00", "10:30", "12:00", "13:30", "15:00", "16:30", "18:00"].map((t) => (
                    <MenuItem key={t} value={t}>
                      {t} {parseInt(t.split(":")[0]) >= 12 ? "PM" : "AM"}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  select
                  label="Select Stylist"
                  value={stylist}
                  onChange={(e) => setStylist(e.target.value)}
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
                >
                  {stylists.map((st) => (
                    <MenuItem key={st.id} value={st.id}>
                      {st.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Special Notes or Requirements"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
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
          </DialogContent>

          <DialogActions sx={{ p: 3, borderTop: "1px solid #2b2b2b", gap: 1 }}>
            <Button onClick={handleCloseBooking} sx={{ color: "#a0a0a0", "&:hover": { color: "#fff" } }}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              variant="contained"
              sx={{
                bgcolor: "#FFD700",
                color: "#000",
                fontWeight: 600,
                px: 3,
                borderRadius: "30px",
                "&:hover": { bgcolor: "#e6c200" },
              }}
            >
              {submitting ? "Booking..." : "Confirm Booking"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Snackbar Confirmation */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="success" sx={{ width: "100%", bgcolor: "#FFD700", color: "#000", fontWeight: 600 }}>
          {successMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={
      <Box sx={{ display: "flex", justifyContent: "center", py: 15, bgcolor: "#111", minHeight: "100vh" }}>
        <CircularProgress sx={{ color: "#FFD700" }} />
      </Box>
    }>
      <ServicesContent />
    </Suspense>
  );
}
