const express = require("express");
const { checkAuth, logOut } = require("../controllers/auth.controller.js");
const csrf = require("csurf");

const authRouter = express.Router();
const csrfProtection = csrf({ 
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: "None"
  } 
});

authRouter.post("/login", csrfProtection, async (req, res) => {
   checkAuth(req, res);
});
authRouter.post("/logout", csrfProtection, async (req, res) => {
   logOut(req, res);
});

module.exports =  authRouter;