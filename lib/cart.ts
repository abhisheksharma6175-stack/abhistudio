export type CartItem = { id: string; name: string; price: number; imageUrl: string; quantity: number };
const CART_KEY = "abhi_cart";
export function getCart(): CartItem[] { if (typeof window === "undefined") return []; try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); } catch { return []; } }
export function saveCart(items: CartItem[]) { localStorage.setItem(CART_KEY, JSON.stringify(items)); window.dispatchEvent(new Event("cart-updated")); }
export function addToCart(product: Omit<CartItem, "quantity">) { const cart = getCart(); const existing = cart.find((item) => item.id === product.id); if (existing) existing.quantity += 1; else cart.push({ ...product, quantity: 1 }); saveCart(cart); }
