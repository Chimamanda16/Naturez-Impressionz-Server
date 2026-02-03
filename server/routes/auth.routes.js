import express from "express";
import { checkAuth, logOut } from "../controllers/auth.controller.js";
import csrf from "csurf";

const authRouter = express.Router();
const csrfProtection = csrf({ cookie: true });

authRouter.post("/login", async (req, res) => {
   checkAuth(req, res);
});
authRouter.post("/logout", csrfProtection, async (req, res) => {
   logOut(req, res);
});

export default authRouter;