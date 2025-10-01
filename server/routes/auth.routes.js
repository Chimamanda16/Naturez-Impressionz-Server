import express from "express";
import csrf from "csurf";
import { checkAuth, logOut } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/login", csrf({ cookie: true }),  async (req, res) => {
   checkAuth(req, res);
});
authRouter.post("/logout", async (req, res) => {
   logOut(req, res);
});

export default authRouter;