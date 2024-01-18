import { Hono } from "hono";
import { cors } from "hono/cors";
import { CastleController } from "./controllers/castle.controller";

export type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("/*", cors({ origin: "*" }));

app.get("/", (c) => c.json({ message: "Hello World" }));

app.get(
  "/markers",
  async (c) => await CastleController.getCastleMarkersByLatlng(c)
);

app.all("*", (c) => c.json({ message: "Not Found" }, 404));

export default app;
