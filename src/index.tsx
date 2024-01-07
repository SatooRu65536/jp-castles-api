import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.json({ message: "Hello World" });
});

app.all("*", (c) => {
  return c.json({ message: "Not Found" }, 404);
});

export default app;
