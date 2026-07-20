import { Box, Button, Container, Divider, Paper, Stack, Typography } from "@mui/material";

const orders = [
  {
    id: "ORD-1001",
    date: "2026-07-20",
    status: "Completed",
    paymentStatus: "Paid",
    totalAmount: 199.99,
    shippingAddress: "123 Main Street, New York, NY",
    items: [
      { name: "Keratin Shampoo", quantity: 2, price: 49.99 },
      { name: "Hair Serum", quantity: 1, price: 99.99 },
    ],
  },
  {
    id: "ORD-1002",
    date: "2026-07-18",
    status: "Processing",
    paymentStatus: "Pending",
    totalAmount: 129.99,
    shippingAddress: "456 Oak Avenue, Los Angeles, CA",
    items: [
      { name: "Facial Cleanser", quantity: 1, price: 59.99 },
      { name: "Moisturizing Kit", quantity: 1, price: 69.99 },
    ],
  },
];

export default function OrdersPage() {
  return (
    <Box sx={{ minHeight: "calc(100vh - 150px)", py: 8, bgcolor: "#0d0d0d", color: "#fff" }}>
      <Container maxWidth="lg">
        <Typography variant="h3" sx={{ mb: 3, fontWeight: 700 }}>
          Your Orders
        </Typography>

        <Stack spacing={3}>
          {orders.map((order) => (
            <Paper key={order.id} sx={{ p: 4, bgcolor: "#1e1e1e", border: "1px solid #2f2f2f" }}>
              <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems="flex-start" spacing={2}>
                <Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Order {order.id}
                  </Typography>
                  <Typography sx={{ color: "#bbb" }}>Placed on {order.date}</Typography>
                </Box>
                <Box sx={{ textAlign: { xs: "left", md: "right" } }}>
                  <Typography sx={{ fontWeight: 700 }}>{order.status}</Typography>
                  <Typography sx={{ color: "#bbb" }}>{order.paymentStatus}</Typography>
                </Box>
                <Box sx={{ textAlign: { xs: "left", md: "right" } }}>
                  <Typography sx={{ fontWeight: 700 }}>${order.totalAmount.toFixed(2)}</Typography>
                  <Typography sx={{ color: "#bbb" }}>Shipping</Typography>
                </Box>
              </Stack>

              <Divider sx={{ my: 3, borderColor: "#333" }} />

              <Stack spacing={2}>
                <Box>
                  <Typography sx={{ fontWeight: 700, mb: 1 }}>Shipping Address</Typography>
                  <Typography sx={{ color: "#ccc" }}>{order.shippingAddress}</Typography>
                </Box>

                <Box>
                  <Typography sx={{ fontWeight: 700, mb: 1 }}>Items</Typography>
                  <Stack spacing={1}>
                    {order.items.map((item) => (
                      <Box key={item.name} sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                        <Typography>{item.quantity} × {item.name}</Typography>
                        <Typography sx={{ color: "#ccc" }}>${(item.price * item.quantity).toFixed(2)}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Stack>

              <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                <Button variant="contained" sx={{ bgcolor: "#FFD700", color: "#000", px: 4, py: 1.2, fontWeight: 700, textTransform: "none", '&:hover': { bgcolor: '#e6c200' } }}>
                  View details
                </Button>
              </Box>
            </Paper>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
