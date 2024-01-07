import { Hono } from "hono";
import { CastleController } from "./controllers/castle.controller";
import { Castle } from "./types/castle";

export type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) => {
  return c.json({ message: "Hello World" });
});

app.get("/castle/get/:id", async (c) => {
  const id = Number(c.req.param("id"));
  return await CastleController.getCastle(c, id);
});

app.post("/castle/create", async (c) => {
  const castle = await c.req.json<Castle>();
  return await CastleController.addCastle(c, castle);
});

app.post("/castle/categories/add", async (c) => {
  const { categories } = await c.req.json<{ categories: string[] }>();
  return await CastleController.addCategories(c, categories);
});

app.get("/castle/categories/get", async (c) => {
  return await CastleController.getCategories(c);
});

app.all("*", (c) => {
  return c.json({ message: "Not Found" }, 404);
});

export default app;
