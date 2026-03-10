import * as client from 'prom-client';

// Shared Prometheus registry — extracted so lightweight consumers
// (seed metrics) can register metrics without pulling in heavy
// runtime modules (stats-service, pool, taskProcessor).
export const prometheusRegistry = new client.Registry();
