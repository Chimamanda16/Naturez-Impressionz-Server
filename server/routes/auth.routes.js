import express from "express";
import { checkAuth, logOut } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/login", async (req, res) => {
   checkAuth(req, res);
});
authRouter.post("/logout", async (req, res) => {
   logOut(req, res);
});

export default authRouter;