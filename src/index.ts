import { Context, Hono } from "hono";
import { cors } from "hono/cors";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { CastleController } from "./controllers/castle.controller";
import { ZodHookRes } from "./types/zod";
import { ErrorRes } from "./types/response";
import { GetMarkersReq, PostMarkersReq } from "./types/request";
import { ContextMarkers } from "./types/context";

export type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

// CORS の設定
app.use("/*", cors({ origin: "*" }));

// ルート
app.get("/", (c) => c.json({ message: "Hello World" }));

const getMarkersSchema = z.object({
  latMin: z.string(),
  latMax: z.string(),
  lngMin: z.string(),
  lngMax: z.string(),
  scale: z.string().optional(),
});

// マーカーを取得する
app.get(
  "/markers",
  zValidator("query", getMarkersSchema, zodHook<GetMarkersReq, ContextMarkers>),
  async (c) => await CastleController.getMarkers(c)
);

const postMarkersSchema = z.object({
  markers: z
    .object({
      name: z.string(),
      coordinates: z.object({
        lat: z.number(),
        lng: z.number(),
      }),
      scale: z.number(),
    })
    .array(),
});

// マーカーを登録する
app.post(
  "/markers",
  zValidator(
    "json",
    postMarkersSchema,
    zodHook<PostMarkersReq, ContextMarkers>
  ),
  async (c) => await CastleController.postMarkers(c)
);

// Not Found
app.all("*", (c) => c.json({ message: "Not Found" }, 404));

/**
 * Zod hook for validating requests
 * @param res {ZodHookRes<T>} Hook result
 * @param c {U} Context
 * @returns {ErrorRes | void} Error response or void
 */
function zodHook<T, U extends Context>(
  res: ZodHookRes<T>,
  c: U
): ErrorRes | void {
  if (res.success) return;

  const { issues } = res.error;
  const message = issues
    .map((i) => `${i.message} at ${i.path.join(", ")}`)
    .join(".\n");
  return c.json({ message }, 400);
}

export default app;
