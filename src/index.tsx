import { Hono } from "hono";

const app = new Hono();

app.get("*", (c) => {
  return c.json({ message: "Not Found" }, 404);
});

app.get("/", (c) => {
  return c.json({ message: "Hello World" });
});

export default app;
