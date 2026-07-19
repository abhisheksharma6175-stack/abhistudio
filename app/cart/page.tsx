"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import DeleteIcon from "@mui/icons-material/Delete";
import { Alert, Box, Button, Container, Divider, IconButton, Paper, TextField, Typography } from "@mui/material";
import { CartItem, getCart, saveCart } from "@/lib/cart";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => setItems(getCart()), []);
  const total = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const update = (next: CartItem[]) => { setItems(next); saveCart(next); };
  async function checkout() {
    setBusy(true); setMessage("");
    const response = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items, shippingAddress: address }) });
    const data = await response.json(); setBusy(false);
    if (!response.ok) return setMessage(data.error || "Could not place your order.");
    update([]); setAddress(""); setMessage("Order placed successfully. Thank you!");
  }
  return <Box sx={{ minHeight: "calc(100vh - 150px)", bgcolor: "#111", py: 7 }}><Container maxWidth="md">
    <Typography variant="h3" sx={{ color: "#fff", fontWeight: 700, mb: 4 }}>Your Cart</Typography>
    {message && <Alert severity={message.startsWith("Order") ? "success" : "error"} sx={{ mb: 3 }}>{message}</Alert>}
    {items.length === 0 ? <Paper sx={{ p: 5, textAlign: "center", bgcolor: "#1b1b1b", color: "#fff" }}><Typography variant="h6">Your cart is empty.</Typography><Button component={Link} href="/products" sx={{ color: "#FFD700", mt: 2 }}>Browse products</Button></Paper> : <Paper sx={{ p: { xs: 2, sm: 4 }, bgcolor: "#1b1b1b", color: "#fff" }}>
      {items.map((item) => <Box key={item.id} sx={{ display: "flex", gap: 2, alignItems: "center", py: 2 }}>
        <Box component="img" src={item.imageUrl} alt="" sx={{ width: 72, height: 72, objectFit: "cover", borderRadius: 2 }} />
        <Box sx={{ flexGrow: 1 }}><Typography sx={{ fontWeight: 700 }}>{item.name}</Typography><Typography sx={{ color: "#FFD700" }}>${item.price.toFixed(2)}</Typography></Box>
        <TextField type="number" size="small" value={item.quantity} slotProps={{ htmlInput: { min: 1 } }} onChange={(event) => update(items.map((x) => x.id === item.id ? { ...x, quantity: Math.max(1, Number(event.target.value)) } : x))} sx={{ width: 75, bgcolor: "#fff" }} />
        <IconButton onClick={() => update(items.filter((x) => x.id !== item.id))} sx={{ color: "#ff6b6b" }}><DeleteIcon /></IconButton>
      </Box>)}
      <Divider sx={{ borderColor: "#444", my: 2 }} />
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}><Typography variant="h5">Total</Typography><Typography variant="h5" sx={{ color: "#FFD700", fontWeight: 700 }}>${total.toFixed(2)}</Typography></Box>
      <TextField required multiline minRows={2} label="Shipping address" value={address} onChange={(event) => setAddress(event.target.value)} fullWidth sx={{ mb: 2, bgcolor: "#fff" }} />
      <Button onClick={checkout} disabled={busy || !address.trim()} variant="contained" sx={{ bgcolor: "#FFD700", color: "#000", fontWeight: 700 }}>{busy ? "Placing order…" : "Place order"}</Button>
      <Typography variant="body2" sx={{ color: "#a0a0a0", mt: 2 }}>You’ll be asked to sign in if you haven’t already.</Typography>
    </Paper>}
  </Container></Box>;
}
