import { registerOtel } from "@medusajs/medusa"
import otelApi from "@opentelemetry/api"
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc"
import Sentry from "@sentry/node"
import { SentryPropagator, SentrySpanProcessor } from "@sentry/opentelemetry"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? "1.0"),
  // @ts-expect-error - instrumenter option is valid for Sentry+OpenTelemetry integration but not in types
  instrumenter: "otel",
})

otelApi.propagation.setGlobalPropagator(new SentryPropagator())

export function register() {
  registerOtel({
    serviceName: process.env.SENTRY_NAME || "medusa-default",
    spanProcessors: [new SentrySpanProcessor()],
    traceExporter: new OTLPTraceExporter(),
    instrument: {
      http: true,
      workflows: true,
      query: true,
      db: true,
    },
  })
}
