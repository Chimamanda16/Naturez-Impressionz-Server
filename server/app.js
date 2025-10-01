import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from 'mongoose';
import postRouter from "./routes/posts.routes.js";
import authRouter from "./routes/auth.routes.js";
import adminRouter from "./routes/admin.routes.js"
import csrf from "csurf";
import cookieParser from "cookie-parser"
import jwt from "jsonwebtoken"

const app = express();
dotenv.config();
mongoose.connect(process.env.MONGO_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);
const allowed = ["http://localhost:5173", "https://ninews.ng"];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowed.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"]
}));

app.use(express.json());
app.use(cookieParser());


app.use("/api", postRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
// CSRF token route
const csrfProtection = csrf({ cookie: true });

app.get("/api/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});
app.get("/api/me", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Not logged in" });
  try {
    const decoded = jwt.verify(token, "jwt-secret");
    res.status(200).json({ userId: decoded.userId});
  } catch(err) {
    console.error("JWT error", err)
    res.status(403).json({ error: "Invalid token" });
  }
});
app.get("/", (req, res) =>{
    res.send("Hello")
});

app.listen(process.env.PORT, ()=>{
    console.log(`Server has started on port ${process.env.PORT}`);
})