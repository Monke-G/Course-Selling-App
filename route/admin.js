const { Router } = require("express");
const { adminModel } = require("../db");

const adminRouter = Router();

adminRouter.post("/signup", function (req, res) {
  res.json({
    message: "admin signup endpoint",
  });
});

adminRouter.post("/signin", function (req, res) {
  res.json({
    message: "admin signin endpoint",
  });
});

adminRouter.post("/course", function (req, res) {
  res.json({
    message: "admin course creation endpoint",
  });
});

adminRouter.put("/course", function (req, res) {
  res.json({
    message: "admin course edit endpoint",
  });
});

adminRouter.get("/course/bulk", function (req, res) {
  res.json({
    message: "admin course getting endpoint",
  });
});

adminRouter.delete("/course", function (req, res) {
  res.json({
    message: "admin course deletion endpoint",
  });
});

module.exports = {
    adminRouter: adminRouter
}