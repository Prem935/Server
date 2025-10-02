import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { connect } from "./lib/db.js";
import { mountSwagger } from "./lib/swagger.js";
import authRouter from "./routes/auth.js";
import taskRouter from "./routes/tasks.js";
import healthRouter from "./routes/health.js";
import { notFoundHandler, errorHandler } from "./middleware/error.js";

const app = express();
app.use(cors());
app.options("*", cors());
app.use(helmet());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/tasks", taskRouter);
mountSwagger(app);
app.use("/api/health", healthRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const port = Number(process.env.PORT || 5000);

connect().then(() => {
  app.listen(port, () => {});
});
