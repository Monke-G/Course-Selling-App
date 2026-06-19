const { Router } = require("express");
const { userModel } = require("../db");

const userRouter = Router();

userRouter.post("/signup", function (req, res){
    res.json({
        message: "user signup endpoint"
    })
})

userRouter.post("/signin", function (req, res) {
    res.json({
        message: "user signin endpoint"
    })
})

userRouter.get("/purchases", function (req, res) {
    res.json({
        message: "user purchased endpoint"
    })
})

module.exports = {
    userRouter: userRouter
}