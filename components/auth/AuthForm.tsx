"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Alert, Box, Button, Container, Paper, TextField, Typography } from "@mui/material";

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter(); const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const signup = mode === "signup";
  async function submit(e: React.FormEvent) { e.preventDefault(); setLoading(true); setError(""); try { const response = await fetch(`/api/auth/${signup ? "register" : "login"}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(signup ? { name, email, password } : { email, password }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error); 
  
  // Dispatch event to notify Header component about user update
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("user-updated"));
  }
  
  router.push(data.user?.role === "ADMIN" ? "/admin" : "/"); router.refresh(); } catch (err) { setError(err instanceof Error ? err.message : "Something went wrong."); } finally { setLoading(false); } }
  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      color: "#fff",
      backgroundColor: "transparent",
      "& fieldset": { borderColor: "#444" },
      "&:hover fieldset": { borderColor: "#777" },
      "&.Mui-focused fieldset": { borderColor: "#FFD700" },
      "& input": {
        backgroundColor: "transparent !important",
        WebkitBoxShadow: "0 0 0 1000px transparent inset !important",
        WebkitTextFillColor: "#fff !important",
        caretColor: "#fff",
      },
      "& input:-webkit-autofill": {
        WebkitBoxShadow: "0 0 0 1000px transparent inset !important",
        WebkitTextFillColor: "#fff !important",
        backgroundColor: "transparent !important",
        caretColor: "#fff",
      },
      "& input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active": {
        WebkitBoxShadow: "0 0 0 1000px transparent inset !important",
        WebkitTextFillColor: "#fff !important",
        backgroundColor: "transparent !important",
      },
    },
    "& .MuiFormHelperText-root": { color: "#a0a0a0" },
  };
  const fieldLabelSx = { display: "block", color: "#c5c5c5", fontSize: "0.8rem", mb: 0.75 };

  return (
    <Box
      sx={{
        minHeight: "calc(100dvh - 150px)",
        display: "flex",
        alignItems: "center",
        bgcolor: "#111",
        py: { xs: 4, sm: 8 },
      }}
    >
      <Container maxWidth="sm" sx={{ width: "100%" }}>
        <Paper
          component="form"
          onSubmit={submit}
          sx={{
            width: "100%",
            maxWidth: 520,
            mx: "auto",
            p: { xs: 3, sm: 5 },
            bgcolor: "#1b1b1b",
            border: "1px solid #2b2b2b",
            borderRadius: 2,
            boxSizing: "border-box",
          }}
        >
          <Typography variant="h4" sx={{ color: "#fff", fontWeight: 700, fontSize: { xs: "2rem", sm: "2.125rem" } }}>
            {signup ? "Create your account" : "Welcome back"}
          </Typography>
          <Typography sx={{ color: "#a0a0a0", mt: 1, mb: 4 }}>
            {signup ? "Sign up to manage bookings and orders." : "Sign in to continue to Abhi Studio."}
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {signup && (
            <Box sx={{ mb: 2 }}>
              <Typography component="label" htmlFor="auth-name" sx={fieldLabelSx}>Full name</Typography>
              <TextField required id="auth-name" value={name} onChange={(e) => setName(e.target.value)} fullWidth sx={fieldSx} />
            </Box>
          )}
          <Box sx={{ mb: 2 }}>
            <Typography component="label" htmlFor="auth-email" sx={fieldLabelSx}>Email address</Typography>
            <TextField required id="auth-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth sx={fieldSx} />
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography component="label" htmlFor="auth-password" sx={fieldLabelSx}>Password</Typography>
            <TextField required id="auth-password" type="password" helperText={signup ? "Use at least 8 characters." : undefined} value={password} onChange={(e) => setPassword(e.target.value)} fullWidth sx={fieldSx} />
          </Box>
          <Button type="submit" disabled={loading} fullWidth variant="contained" sx={{ bgcolor: "#FFD700", color: "#000", py: 1.4, fontWeight: 700, "&:hover": { bgcolor: "#e6c200" } }}>
            {loading ? "Please wait…" : signup ? "Create account" : "Sign in"}
          </Button>
          <Typography sx={{ color: "#a0a0a0", textAlign: "center", mt: 3 }}>
            {signup ? "Already have an account? " : "New to Abhi Studio? "}
            <Link href={signup ? "/login" : "/signup"} style={{ color: "#FFD700" }}>
              {signup ? "Sign in" : "Create an account"}
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
