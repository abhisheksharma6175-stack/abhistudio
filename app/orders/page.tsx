"use client";

import { useEffect, useState } from "react";
import { Alert, Box, Button, Container, Divider, Paper, Stack, Typography } from "@mui/material";

type OrderItem = {
  quantity: number;
  price: number;
  product?: { id?: string; name?: string };
};

type Order = {
  id: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  shippingAddress: string;
  createdAt: string;
  items: OrderItem[];
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      try {
        const response = await fetch("/api/orders");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "Unable to fetch orders.");
        }

        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Unable to load your orders.");
      } finally {
        setLoading(false);
      }
    }

    void loadOrders();
  }, []);

  const formatDate = (value: string) => {
    if (!value) return "—";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <Box sx={{ minHeight: "calc(100vh - 150px)", py: 8, bgcolor: "#0d0d0d", color: "#fff" }}>
      <Container maxWidth="lg">
        <Typography variant="h3" sx={{ mb: 3, fontWeight: 700 }}>
          Your Orders
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
        )}

        {loading ? (
          <Paper sx={{ p: 4, bgcolor: "#1e1e1e", border: "1px solid #2f2f2f" }}>
            <Typography sx={{ color: "#bbb" }}>Loading your orders…</Typography>
          </Paper>
        ) : orders.length === 0 ? (
          <Paper sx={{ p: 4, bgcolor: "#1e1e1e", border: "1px solid #2f2f2f" }}>
            <Typography variant="h6" sx={{ mb: 1 }}>No orders yet</Typography>
            <Typography sx={{ color: "#bbb" }}>Once you place an order, it will appear here with its status.</Typography>
          </Paper>
        ) : (
          <Stack spacing={3}>
            {orders.map((order) => (
              <Paper key={order.id} sx={{ p: 4, bgcolor: "#1e1e1e", border: "1px solid #2f2f2f" }}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Box>
                    <Typography variant="h6" sx={{ mb: 1 }}>Order {order.id}</Typography>
                    <Typography sx={{ color: "#bbb" }}>Placed on {formatDate(order.createdAt)}</Typography>
                  </Box>
                  <Box sx={{ textAlign: { xs: "left", md: "right" } }}>
                    <Typography sx={{ fontWeight: 700, color: order.status === "PENDING" ? "#FFD700" : "#7cf5b1" }}>{order.status}</Typography>
                    <Typography sx={{ color: "#bbb" }}>{order.paymentStatus}</Typography>
                  </Box>
                  <Box sx={{ textAlign: { xs: "left", md: "right" } }}>
                    <Typography sx={{ fontWeight: 700 }}>${Number(order.totalAmount || 0).toFixed(2)}</Typography>
                    <Typography sx={{ color: "#bbb" }}>Total</Typography>
                  </Box>
                </Stack>

                <Divider sx={{ my: 3, borderColor: "#333" }} />

                <Stack spacing={2}>
                  <Box>
                    <Typography sx={{ fontWeight: 700, mb: 1 }}>Shipping Address</Typography>
                    <Typography sx={{ color: "#ccc" }}>{order.shippingAddress || "No address provided."}</Typography>
                  </Box>

                  <Box>
                    <Typography sx={{ fontWeight: 700, mb: 1 }}>Items</Typography>
                    <Stack spacing={1}>
                      {(order.items || []).map((item, idx) => (
                        <Box key={`${item.product?.id || item.product?.name || "item"}-${idx}`} sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                          <Typography>{item.quantity} × {item.product?.name || "Product"}</Typography>
                          <Typography sx={{ color: "#ccc" }}>${((Number(item.price || 0) * Number(item.quantity || 0))).toFixed(2)}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
}
