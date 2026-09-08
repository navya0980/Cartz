import express from "express";
import  "dotenv/config";
import dns from "dns";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
dns.setDefaultResultOrder("ipv4first");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app=express();
import connectDB from "./database/db.js";
import userRoute from "./routes/userRoute.js"
import productRoute from "./routes/productRoute.js"
import cartRoute from "./routes/cartRoute.js"
import orderRoute from "./routes/orderRoute.js"
const PORT=process.env.PORT||3000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use("/user",userRoute);
app.use("/product",productRoute);
app.use("/cart",cartRoute);
app.use("/orders",orderRoute);

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.statusCode || 500).json({
    success: err.success === false ? false : true,
    message: err.message || "Internal Server Error"
  });
});

app.listen(PORT, "0.0.0.0", () => {
  connectDB();
  console.log(`Server listening at port ${PORT}`);
});
