import { Hono } from "hono";
import { CastleController } from "./controllers/castle.controller";

export type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) => {
  return c.json({ message: "Hello World" });
});

app.get("/markeres", async (c) => {
  const latMin = Number(c.req.queries("latMin"));
  const latMax = Number(c.req.queries("latMax"));
  const lngMin = Number(c.req.queries("lngMin"));
  const lngMax = Number(c.req.queries("lngMax"));

  return await CastleController.getCastleMarkerByLatLngRange(c, [latMin, latMax], [lngMin, lngMax]);
});

app.all("*", (c) => {
  return c.json({ message: "Not Found" }, 404);
});

export default app;
