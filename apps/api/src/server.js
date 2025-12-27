import express from 'express';
import cors from 'cors';
import { requestId } from "./middlewares/requestId.js";
import { notFoundRoute } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";

import authRoutes from "./routes/auth.routes.js";
import courseRoutes from "./routes/course.routes.js";
import checkoutRoutes from "./routes/checkout.routes.js";
import lessonRoutes from "./routes/lesson.routes.js";
import instructorRoutes from "./routes/instructor.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import meRoutes from "./routes/me.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(requestId);
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => res.json({ data: { ok: true }, requestId: req.requestId }));

  app.use("/auth", authRoutes);
  app.use("/courses", courseRoutes);
  app.use("/checkout", checkoutRoutes);
  app.use("/lesson-requests", lessonRoutes);
  app.use("/instructor", instructorRoutes);
  app.use("/notifications", notificationRoutes);
  app.use("/me", meRoutes);

    app.use(notFoundRoute);
  app.use(errorHandler);

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
  });
};

export { app, startServer };
