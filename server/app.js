const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const postRouter = require("./routes/posts.routes.js");
const authRouter = require("./routes/auth.routes.js");
const adminRouter = require("./routes/admin.routes.js");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ userId: decoded.userId});
  } catch(err) {
    console.error("JWT error", err)
    res.status(403).json({ error: "Invalid token" });
  }
});
app.get("/", csrfProtection, (req, res) =>{
    res.send("Hello")
});

module.exports = app;