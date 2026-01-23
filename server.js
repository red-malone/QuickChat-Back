import express from "express";
import cors from "cors";
import http from "http";
import morgan from "morgan";
import helmet from "helmet";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
import connectDB from "./lib/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

//Db Connection
await connectDB();

// Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Chat App API",
      version: "1.0.0",
      description: "API documentation for the Chat App",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
const app = express();
const server = http.createServer(app);

//Middleware
app.use(express.json({ limit: "4mb" }));
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());

//Health Status
app.use("/api/status", (req, res) => {
  res.send({ status: "OK", message: "Server is running" });
});
// Swagger UI setup
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, { explorer: true }),
);

//Invalid Route Handler
app.use((req, res, next) => {
  res.status(404).send({ status: "Failed", message: "Route not found" });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
