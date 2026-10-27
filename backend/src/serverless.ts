import type { IncomingMessage, ServerResponse } from 'http';
import { createApp } from './app.setup';

type Handler = (req: IncomingMessage, res: ServerResponse) => void;

// Reused across warm invocations so Nest boots (and Mongo connects) once per instance.
let handlerPromise: Promise<Handler> | undefined;

async function getHandler(): Promise<Handler> {
  const app = await createApp();
  await app.init();
  return app.getHttpAdapter().getInstance();
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  handlerPromise ??= getHandler().catch((err) => {
    handlerPromise = undefined;
    throw err;
  });
  const expressApp = await handlerPromise;
  expressApp(req, res);
}
