import { connectDB } from "@/lib/mongodb";

export const defaultCategories = [
  { name: "Hair Care", slug: "hair-care" },
  { name: "Skin Care", slug: "skin-care" },
  { name: "Hair Styling", slug: "hair-styling" },
  { name: "Nail Care", slug: "nail-care" },
];

export const defaultProducts = [
  {
    name: "Luxury Repair Shampoo",
    description: "Deep cleansing shampoo that restores moisture and shine for dry, damaged hair.",
    price: 42,
    stock: 24,
    imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop",
    category: "Hair Care",
  },
  {
    name: "Hydrating Hair Serum",
    description: "Lightweight serum for frizz control and smooth, glossy hair throughout the day.",
    price: 36,
    stock: 18,
    imageUrl: "https://images.unsplash.com/photo-1521590832167-7b9b8d7f5f0d?q=80&w=800&auto=format&fit=crop",
    category: "Hair Care",
  },
  {
    name: "Glow Facial Kit",
    description: "A skin-brightening facial set designed to hydrate, smooth, and refresh tired skin.",
    price: 58,
    stock: 15,
    imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop",
    category: "Skin Care",
  },
  {
    name: "Signature Blowout",
    description: "Professional salon styling treatment that gives volume, polish, and long-lasting elegance.",
    price: 68,
    stock: 30,
    imageUrl: "https://images.unsplash.com/photo-1521590832167-7b9b8d7f5f0d?q=80&w=800&auto=format&fit=crop",
    category: "Hair Styling",
  },
  {
    name: "Luxury Nail Care Set",
    description: "A premium nail care kit with essentials for healthier nails and a polished finish.",
    price: 48,
    stock: 20,
    imageUrl: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800&auto=format&fit=crop",
    category: "Nail Care",
  },
];

export const defaultServices = [
  {
    name: "Classic Haircut",
    description: "Precision cut and finish tailored to your face shape and styling preferences.",
    price: 45,
    duration: 45,
    imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop",
    category: "Hair Styling",
  },
  {
    name: "Deep Conditioning Treatment",
    description: "Nourishing moisture therapy that restores softness, shine, and manageability.",
    price: 55,
    duration: 60,
    imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800&auto=format&fit=crop",
    category: "Hair Care",
  },
  {
    name: "Glow Facial Therapy",
    description: "Refreshing facial treatment to cleanse, hydrate, and brighten dull skin.",
    price: 75,
    duration: 50,
    imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop",
    category: "Skin Care",
  },
  {
    name: "Gel Manicure",
    description: "Long-lasting manicure with a protective high-shine finish and refined detailing.",
    price: 40,
    duration: 40,
    imageUrl: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800&auto=format&fit=crop",
    category: "Nail Care",
  },
];

function slugify(value: string) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "item";
}

async function countCollection(collection: any, query: Record<string, unknown> = {}) {
  if (typeof collection?.countDocuments === "function") {
    return await collection.countDocuments(query);
  }
  return (await collection.find(query).toArray()).length;
}

async function ensureCategorySlugDefaults() {
  const db = await connectDB();
  const categoryCollection = db.collection("Category");
  const categories = await categoryCollection.find({}).toArray();

  for (const category of categories) {
    const needsSlug = !category.slug || category.slug !== slugify(category.name || "");
    if (needsSlug) {
      await categoryCollection.updateOne(
        { _id: category._id },
        { $set: { slug: slugify(category.name || ""), updatedAt: new Date() } }
      );
    }
  }
}

export async function ensureCatalogSeed() {
  const db = await connectDB();
  const categoryCollection = db.collection("Category");
  const productCollection = db.collection("Product");
  const serviceCollection = db.collection("Service");

  if ((await countCollection(categoryCollection)) === 0) {
    const now = new Date();
    if (typeof categoryCollection.insertMany === "function") {
      await categoryCollection.insertMany(
        defaultCategories.map((category) => ({
          ...category,
          createdAt: now,
          updatedAt: now,
        }))
      );
    }
  }

  await ensureCategorySlugDefaults();

  if ((await countCollection(productCollection)) === 0) {
    const categories = await categoryCollection.find({}).toArray();
    const products = defaultProducts.map((product) => {
      const found = categories.find((category) => category.name === product.category);
      return {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        imageUrl: product.imageUrl,
        categoryId: found?._id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    if (typeof productCollection.insertMany === "function") {
      await productCollection.insertMany(products);
    }
  }

  if ((await countCollection(serviceCollection)) === 0) {
    const categories = await categoryCollection.find({}).toArray();
    const services = defaultServices.map((service) => {
      const found = categories.find((category) => category.name === service.category);
      return {
        name: service.name,
        description: service.description,
        price: service.price,
        duration: service.duration,
        imageUrl: service.imageUrl,
        categoryId: found?._id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    if (typeof serviceCollection.insertMany === "function") {
      await serviceCollection.insertMany(services);
    }
  }
}
