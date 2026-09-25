 import express from("express");
 import cors from("cors");
 import helmet from("helmet");
 import morgan from("morgan");

 import env from("./config/env");

 import {
  notFoundHandler,
  errorHandler,
} from("./middleware/error.middleware");

 import serviceRoutes from("./routes/service.routes");
 import woredaRoutes from("./routes/woreda.routes");
 import citationRoutes from("./routes/citation.routes");
 import feedbackRoutes from("./routes/feedback.routes");
 import voiceRoutes from("./routes/voice.routes");
 import smsRoutes from("./routes/sms.routes");
 import analyticsRoutes from("./routes/analytics.routes");

const app = express();

app.disable("x-powered-by");

app.use(
  helmet()
);

app.use(
  cors({
    origin:
      env.frontendUrl === "*"
        ? "*"
        : env.frontendUrl,
  })
);

app.use(
  express.json({
    limit: "1mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  })
);

if (env.nodeEnv !== "test") {
  app.use(morgan("combined"));
}

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Woreda Navigator API is running",
    environment: env.nodeEnv,
  });
});

app.use("/api/services", serviceRoutes);
app.use("/api/woredas", woredaRoutes);
app.use("/api/citations", citationRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/voice", voiceRoutes);
app.use("/api/sms", smsRoutes);
app.use("/api/analytics", analyticsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;