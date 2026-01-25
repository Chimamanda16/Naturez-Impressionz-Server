const express = require("express");
const serverless = require("serverless-http");
const app = require("../app");

app.get("/", (req, res) => {
  res.send("Hosted on Vercel ");
});

module.exports = app;
module.exports.handler = serverless(app);