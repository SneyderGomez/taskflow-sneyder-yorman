import express from 'express';
import cors from 'cors';

import solicitudesRouter from './routes/solicitudes.js';
import monitorRouter from './routes/monitor.js';
import { notFound, errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(cors({ origin: '*' }));

app.use((req, res, next) => {
  req.redis = global.redisClient;
  next();
});

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, servicio: 'taskflow-backend' });
});

app.use('/solicitudes', solicitudesRouter);
app.use('/monitor', monitorRouter);

app.use(notFound);
app.use(errorHandler);

export default app;