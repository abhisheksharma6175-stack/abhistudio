"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DeleteIcon from "@mui/icons-material/Delete";
import { Alert, Box, Button, Container, Divider, IconButton, Paper, TextField, Typography } from "@mui/material";
import { CartItem, getCart, saveCart } from "@/lib/cart";

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [unavailable, setUnavailable] = useState<string[] | null>(null);
  const [insufficient, setInsufficient] = useState<Array<{ id: string; name: string; requested: number; available: number }> | null>(null);
  const [invalidIds, setInvalidIds] = useState<string[] | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => setItems(getCart()), []);
  const total = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const update = (next: CartItem[]) => { setItems(next); saveCart(next); };
  async function checkout() {
    setBusy(true); setMessage("");
    setUnavailable(null); setInsufficient(null); setInvalidIds(null);
    // client-side validation: only remove items with truly empty/null ids
    const cleanItems = items.filter((it) => it.id && typeof it.id === "string" && it.id.trim().length > 0);
    if (cleanItems.length === 0 && items.length > 0) {
      // all items are invalid
      update(cleanItems as CartItem[]);
      setBusy(false);
      setMessage("Your cart has no valid items. Please add products and try again.");
      return;
    }
    const response = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items: cleanItems, shippingAddress: address }) });
    const data = await response.json(); setBusy(false);
    if (!response.ok) {
      // structured error details
      if (data.missing) {
        setUnavailable(Array.isArray(data.missing) ? data.missing : []);
        return setMessage(data.error || "One or more products are unavailable.");
      }
      if (data.invalidIds) {
        setInvalidIds(Array.isArray(data.invalidIds) ? data.invalidIds : []);
        return setMessage(data.error || "Invalid product id(s) provided.");
      }
      if (data.insufficient) {
        setInsufficient(Array.isArray(data.insufficient) ? data.insufficient : []);
        return setMessage(data.error || "Insufficient stock for some items.");
      }
      return setMessage(data.error || "Could not place your order.");
    }
    update([]); setAddress(""); setMessage("Order placed successfully. Thank you!");
    // redirect to orders (checkout/confirmation) page
    try { router.push("/orders"); } catch (e) { /* ignore */ }
  }
  return <Box sx={{ minHeight: "calc(100vh - 150px)", bgcolor: "#111", py: 7 }}><Container maxWidth="md">
    <Typography variant="h3" sx={{ color: "#fff", fontWeight: 700, mb: 4 }}>Your Cart</Typography>
    {message && <Alert severity={message.startsWith("Order") ? "success" : "error"} sx={{ mb: 3 }}>{message}</Alert>}
    {unavailable && (
      <Alert severity="error" sx={{ mb: 3 }}>
        The following products are unavailable: <ul>{unavailable.map((id) => <li key={id}>{id}</li>)}</ul>
      </Alert>
    )}
    {insufficient && (
      <Alert severity="error" sx={{ mb: 3 }}>
        Some items have insufficient stock:
        <ul>
          {insufficient.map((it) => (
            <li key={it.id}>{it.name} — requested {it.requested}, available {it.available}</li>
          ))}
        </ul>
      </Alert>
    )}
    {invalidIds && (
      <Alert severity="error" sx={{ mb: 3 }}>
        Invalid product id(s) in your cart: <ul>{invalidIds.map((id) => <li key={id}>{id}</li>)}</ul>
      </Alert>
    )}
    {message.startsWith("Order placed") && (
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Button component={Link} href="/orders" variant="contained" sx={{ bgcolor: "#FFD700", color: "#000", fontWeight: 700 }}>View orders</Button>
        <Button component={Link} href="/products" variant="outlined" sx={{ color: "#FFD700", borderColor: "#444" }}>Continue shopping</Button>
      </Box>
    )}
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
