import express from "express";

const app = express();
app.use(express.json()); // parses JSON bodies for you (replaces the data/end code)

const products = [
  { id: 1, name: "Silver Ring", price: 2499 },
  { id: 2, name: "Gold Chain", price: 15999 },
];

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/products", (req, res) => {
  res.json(products);
});

app.get("/products/count", (req, res) => {
  res.json({ count: products.length });
});

app.get("/products/:id", (req, res) => {
    const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: "id must be a number" });
    return;
  }

  const product = products.find((p) => p.id === id);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(product);
});

app.delete("/products/:id", (req, res) => {
    const id = Number(req.params.id)
    if (Number.isNaN(id)) {
    res.status(400).json({ error: "id must be a number" });
    return;
  }

 const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  products.splice(index, 1);
  res.status(204).end();

})

app.post("/products", (req, res) => {
  const { name, price } = req.body ?? {};
  if (typeof name !== "string" || typeof price !== "number") {
    res.status(400).json({ error: "name (string) and price (number) are required" });
    return;
  }
  const newProduct = { id: products.length + 1, name, price };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Runs only if no route above matched
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(4000, () => console.log("API running on http://localhost:4000"));