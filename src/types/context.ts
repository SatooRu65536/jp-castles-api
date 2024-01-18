import { Context } from "hono";
import { Bindings } from "..";

export type ContextMarkers = Context<{ Bindings: Bindings }, "/markers", {}>;
