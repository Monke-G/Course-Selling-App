const { Router } = require("express");

const courseRouter = Router();

courseRouter.get("/preview", function (req, res) {
        res.json({
        message: "course preview endpoint"
    })
});

courseRouter.post("/purchase", function (req, res) {
        res.json({
        message: "course purchase endpoint"
    })
});

module.exports = {
  courseRouter: courseRouter,
};
