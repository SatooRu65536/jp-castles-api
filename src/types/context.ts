import { Context } from "hono";
import { Bindings } from "..";

export type ContextMarkers = Context<{ Bindings: Bindings }, "/markers", {}>;

export type ContextMarkerData = Context<
  { Bindings: Bindings },
  "/markers/data",
  {}
>;
