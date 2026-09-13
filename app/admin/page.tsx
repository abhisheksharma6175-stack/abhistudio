"use client";
import { useCallback, useEffect, useState, type ComponentType } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Container,
  MenuItem,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography as MuiTypography,
  IconButton,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Typography = MuiTypography as ComponentType<Record<string, unknown>>;

type Category = { id: string; name: string };
type Entity = { id: string; name: string; description: string; price: number; imageUrl?: string | null; stock?: number; duration?: number; categoryId: string; category?: Category };
type Order = {
  id: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;
  shippingAddress?: string;
  user: { name: string | null; email: string };
  items: { quantity: number; product: { name: string } }[];
};

const blank = { name: "", description: "", price: "", imageUrl: "", stock: "0", duration: "60", categoryId: "" };

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<number>(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Entity[]>([]);
  const [services, setServices] = useState<Entity[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState<Entity | null>(null);

  const [categoryForm, setCategoryForm] = useState<{ name: string }>({ name: "" });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const [meRes, catsRes, pRes, sRes, oRes] = await Promise.all([
        fetch("/api/auth/me"),
        fetch("/api/admin/categories"),
        fetch("/api/admin/products"),
        fetch("/api/admin/services"),
        fetch("/api/orders"),
      ]);
      const session = await meRes.json();
      if (session.user?.role !== "ADMIN") {
        router.push("/login");
        return;
      }
      setCategories(await catsRes.json());
      setProducts(await pRes.json());
      setServices(await sRes.json());
      setOrders(await oRes.json());
      setReady(true);
    } catch {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const change = (key: string, value: string) => setForm((current) => ({ ...current, [key]: value }));

  async function saveEntity(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const type = tab === 1 ? "products" : "services";
    const body = { ...form, ...(editing ? { id: editing.id } : {}) };
    const response = await fetch(`/api/admin/${type}`, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!response.ok) {
      setError((await response.json()).error || "Could not save changes.");
      return;
    }
    setForm(blank);
    setEditing(null);
    refresh();
  }

  async function removeEntity(id: string) {
    if (!confirm("Delete this item?")) return;
    const type = tab === 1 ? "products" : "services";
    const response = await fetch(`/api/admin/${type}?id=${id}`, { method: "DELETE" });
    if (!response.ok) setError((await response.json()).error || "Could not delete item."); else refresh();
  }

  function editEntity(item: Entity) {
    setEditing(item);
    setForm({ name: item.name, description: item.description, price: String(item.price), imageUrl: item.imageUrl || "", stock: String(item.stock ?? 0), duration: String(item.duration ?? 60), categoryId: item.categoryId });
  }

  async function saveCategory(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const body = { ...categoryForm, ...(editingCategory ? { id: editingCategory.id } : {}) };
    const response = await fetch(`/api/admin/categories`, { method: editingCategory ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!response.ok) {
      setError((await response.json()).error || "Could not save category.");
      return;
    }
    setCategoryForm({ name: "" });
    setEditingCategory(null);
    refresh();
  }

  async function removeCategory(id: string) {
    if (!confirm("Delete this category?")) return;
    const response = await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
    if (!response.ok) setError((await response.json()).error || "Could not delete category."); else refresh();
  }

  function editCategory(cat: Category) {
    setEditingCategory(cat);
    setCategoryForm({ name: cat.name });
  }

  async function updateOrder(id: string, status: string, paymentStatus?: string) {
    await fetch("/api/admin/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, paymentStatus }),
    });
    refresh();
  }

  if (!ready) return <Box sx={{ minHeight: "70vh", bgcolor: "#111", color: "#fff", p: 8, textAlign: "center" }}>Loading admin workspace…</Box>;
  if (error && !categories.length) return <Box sx={{ minHeight: "70vh", bgcolor: "#111", p: 8 }}><Container><Alert severity="error">{error}</Alert></Container></Box>;

  return (
    <Box sx={{ minHeight: "calc(100vh - 150px)", bgcolor: "#111", py: 5 }}>
      <Container maxWidth="xl">
        <Typography variant="h3" sx={{ color: "#fff", fontWeight: 700, mb: 3 }}>Admin panel</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>{error}</Alert>}
        <Paper sx={{ bgcolor: "#1b1b1b", color: "#fff", p: { xs: 2, sm: 4 } }}>
          <Tabs value={tab} onChange={(_, value) => { setTab(value); setEditing(null); setForm(blank); setEditingCategory(null); setCategoryForm({ name: "" }); }} sx={{ mb: 4, "& .MuiTab-root": { color: "#bbb" }, "& .Mui-selected": { color: "#FFD700" } }}>
            <Tab label="Categories" />
            <Tab label="Products" />
            <Tab label="Services" />
            <Tab label="Orders" />
          </Tabs>

          {tab === 0 && (
            <Box>
              <Box component="form" onSubmit={saveCategory} sx={{ display: "flex", gap: 2, mb: 3 }}>
                <TextField required label="Category name" value={categoryForm.name} onChange={(e) => setCategoryForm({ name: e.target.value })} sx={{ bgcolor: "#fff", flex: 1 }} />
                <Button type="submit" variant="contained" sx={{ bgcolor: "#FFD700", color: "#000" }}>{editingCategory ? "Update" : "Create"}</Button>
              </Box>

              <Box>
                {categories.map((cat) => (
                  <Paper key={cat.id} sx={{ p: 2, mb: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box>{cat.name}</Box>
                    <Box>
                      <IconButton size="small" onClick={() => editCategory(cat)} sx={{ color: "#FFD700" }}><EditIcon /></IconButton>
                      <IconButton size="small" onClick={() => removeCategory(cat.id)} sx={{ color: "#ff6b6b" }}><DeleteIcon /></IconButton>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </Box>
          )}

          {(tab === 1 || tab === 2) && (
            <>
              <Box component="form" onSubmit={saveEntity} sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, gap: 2, mb: 5 }}>
                <TextField required label="Name" value={form.name} onChange={(e) => change("name", e.target.value)} sx={{ bgcolor: "#fff" }} />
                <TextField required select label="Category" value={form.categoryId} onChange={(e) => change("categoryId", e.target.value)} sx={{ bgcolor: "#fff" }}>
                  {categories.map((cat) => <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>)}
                </TextField>
                <TextField required label="Description" value={form.description} onChange={(e) => change("description", e.target.value)} multiline minRows={2} sx={{ bgcolor: "#fff" }} />
                <TextField label="Image URL" value={form.imageUrl} onChange={(e) => change("imageUrl", e.target.value)} required={tab === 1} sx={{ bgcolor: "#fff" }} />
                <TextField required type="number" label="Price" value={form.price} onChange={(e) => change("price", e.target.value)} sx={{ bgcolor: "#fff" }} />
                {tab === 1 ? (
                  <TextField required type="number" label="Stock" value={form.stock} onChange={(e) => change("stock", e.target.value)} sx={{ bgcolor: "#fff" }} />
                ) : (
                  <TextField required type="number" label="Duration (minutes)" value={form.duration} onChange={(e) => change("duration", e.target.value)} sx={{ bgcolor: "#fff" }} />
                )}
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button type="submit" variant="contained" sx={{ bgcolor: "#FFD700", color: "#000" }}>{editing ? "Update" : "Create"}</Button>
                  {editing && <Button onClick={() => { setEditing(null); setForm(blank); }} variant="outlined" sx={{ color: "#fff", borderColor: "#444" }}>Cancel</Button>}
                </Box>
              </Box>

              <Box>
                {(tab === 1 ? products : services).map((item) => (
                  <Paper key={item.id} sx={{ p: 2, mb: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box>
                      <Box sx={{ fontWeight: 700 }}>{item.name}</Box>
                      <Box sx={{ color: "#bbb" }}>{item.description}</Box>
                    </Box>
                    <Box>
                      <Button onClick={() => editEntity(item)} sx={{ mr: 1 }} variant="text">Edit</Button>
                      <Button onClick={() => removeEntity(item.id)} color="error" variant="text">Delete</Button>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </>
          )}

          {tab === 3 && (
            <Box>
              {orders.map((order) => (
                <Paper key={order.id} sx={{ p: 2, mb: 2 }}>
                  <Stack direction={{ xs: "column", md: "row" }} sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", md: "center" }, gap: 2 }}>
                    <Box>
                      <Box sx={{ fontWeight: 700 }}>Order {order.id}</Box>
                      <Box sx={{ color: "#bbb" }}>Placed by {order.user?.email || "Unknown user"}</Box>
                      <Box sx={{ color: "#bbb" }}>Address: {order.shippingAddress || "No address supplied"}</Box>
                      <Box sx={{ color: "#bbb" }}>Total: ${Number(order.totalAmount || 0).toFixed(2)}</Box>
                    </Box>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                      <Button
                        onClick={() => updateOrder(order.id, order.status === "PENDING" ? "COMPLETED" : "PENDING", order.paymentStatus)}
                        variant="contained"
                        sx={{ bgcolor: "#FFD700", color: "#000" }}
                      >
                        {order.status === "PENDING" ? "Mark completed" : "Mark pending"}
                      </Button>
                      <Button
                        onClick={() => updateOrder(order.id, order.status, order.paymentStatus === "PENDING" ? "PAID" : "PENDING")}
                        variant="outlined"
                        sx={{ color: "#000", borderColor: "#444" }}
                      >
                        {order.paymentStatus === "PENDING" ? "Mark paid" : "Mark pending payment"}
                      </Button>
                    </Stack>
                  </Stack>
                </Paper>
              ))}
            </Box>
          )}

        </Paper>
      </Container>
    </Box>
  );
}
