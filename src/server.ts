import { createServer } from "node:http";

const products = [
  { id: 1, name: "Silver Ring", price: 2499 },
  { id: 2, name: "Gold Chain", price: 15999 },
  { id: 3, name: "Copper Glass", price: 4000 },
];

const server = createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
  res.setHeader("Content-Type", "application/json");

  // GET /health
  if (req.method === "GET" && url.pathname === "/health") {
    res.writeHead(200);
    return res.end(JSON.stringify({ status: "ok" }));
  }

  // GET /products
  if (req.method === "GET" && url.pathname === "/products") {
    res.writeHead(200);
    return res.end(JSON.stringify(products));
  }

  // GET /products/count
  if (req.method === "GET" && url.pathname === "/products/count") {
    res.writeHead(200);
    return res.end(JSON.stringify({ count: products.length }));
  }

  // GET /products/:id
  const match = url.pathname.match(/^\/products\/(\d+)$/);
  if (req.method === "GET" && match) {
    const product = products.find((p) => p.id === Number(match[1]));
    if (!product) {
      res.writeHead(404);
      return res.end(JSON.stringify({ error: "Product not found" }));
    }
    res.writeHead(200);
    return res.end(JSON.stringify(product));
  }

  // POST /products
if (req.method === "POST" && url.pathname === "/products") {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk; // collect each piece
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);

      if (typeof data.name !== "string" || typeof data.price !== "number") {
        res.writeHead(400);
        return res.end(JSON.stringify({ error: "name (string) and price (number) are required" }));
      }

      const newProduct = { id: products.length + 1, name: data.name, price: data.price };
      products.push(newProduct);

      res.writeHead(201); // 201 = Created
      res.end(JSON.stringify(newProduct));
    } catch {
      res.writeHead(400);
      res.end(JSON.stringify({ error: "Body must be valid JSON" }));
    }
  });

  return; // stop here; the response is sent later, inside "end"
}
  res.writeHead(404);
  res.end(JSON.stringify({ error: "Route not found" }));
});

server.listen(4000, () => console.log("API running on http://localhost:4000"));