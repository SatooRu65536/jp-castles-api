import { Context, Hono } from 'hono';
import { cors } from 'hono/cors';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { MarkerController } from './controllers/marker.controller';
import { ZodHookRes } from './types/zod';
import { ErrorRes } from './types/response';
import {
  GetMarkersReq,
  PostMarkersReq,
  PutMarkerReq,
  deleteMarkersReq,
} from './types/request';
import { ContextMarkers } from './types/context';

export type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

// CORS の設定
app.use('/*', cors({ origin: '*' }));

// ルート
app.get('/', (c) => c.json({ message: 'Hello World' }));

const getMarkersSchema = z.object({
  latMin: z.string(),
  latMax: z.string(),
  lngMin: z.string(),
  lngMax: z.string(),
  scale: z.string().optional(),
});

// マーカーを取得する
app.get(
  '/markers',
  zValidator('query', getMarkersSchema, zodHook<GetMarkersReq, ContextMarkers>),
  async (c) => await MarkerController.getMarkers(c)
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
  '/markers',
  zValidator(
    'json',
    postMarkersSchema,
    zodHook<PostMarkersReq, ContextMarkers>
  ),
  async (c) => await MarkerController.postMarkers(c)
);

const putMarkerSchema = z.object({
  marker: z.object({
    id: z.string(),
    name: z.string(),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
    scale: z.number(),
  }),
});

// マーカーを更新する
app.put(
  '/markers',
  zValidator('json', putMarkerSchema, zodHook<PutMarkerReq, ContextMarkers>),
  async (c) => await MarkerController.putMarkers(c)
);

const deleteMarkersSchema = z.object({
  ids: z.string().array(),
});

// マーカーを削除する
app.delete(
  '/markers',
  zValidator(
    'json',
    deleteMarkersSchema,
    zodHook<deleteMarkersReq, ContextMarkers>
  ),
  async (c) => await MarkerController.deleteMarkers(c)
);

// マーカーの情報を取得する
app.get('/markers/data', async (c) => await MarkerController.getMarkerData(c));

// Not Found
app.all('*', (c) => c.json({ message: 'Not Found' }, 404));

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
    .map((i) => `${i.message} at ${i.path.join(', ')}`)
    .join('.\n');
  return c.json({ message }, 400);
}

export default app;
