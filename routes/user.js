const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z, regex } = require("zod");
const { userModel, purchasesModel } = require("../db");
const { JWT_USER_PASSWORD } = require("../config");
const { userMiddleware } = require("../middleware/user")

const userRouter = Router();

userRouter.post("/signup", async function (req, res){
    const requiredBody = z.object({
        email: z.string().min(3).max(100).email(),
        password: z.string().min(3).max(30).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/).regex(/[^A-Za-z0-9]/),
        firstName: z.string().min(3).max(50),
        lastName: z.string().min(3).max(50)
    })

    const parsedData = requiredBody.safeParse(req.body);

    if (!parsedData.success) {
        res.json({
            message: "Incorrect format",
            error: parsedData.error
        })
        return
    }

    const { email, password, firstName, lastName } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    
    await userModel.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
    })

    res.json({
        message: "You are logged in"
    })
})

userRouter.post("/signin", async function (req, res) {
    const { email, password } = req.body;
    
    const user = await userModel.findOne({
        email,
    });

    if(!user) {
        res.status(403).json({
            message: "User doesn't exist in our database"
        })
        return
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
        const token = jwt.sign(
            {
                id: user._id,
            },
            JWT_USER_PASSWORD,
        );
        res.json({
            token,
        });
    } else {
        res.status(403).json({
            message: "Incorrect credentials",
        });
    }
});

userRouter.get("/purchases", userMiddleware, async function (req, res) {
    const userId = req.userId;

    const purchases = await purchasesModel.find({
        userId,
    })

    res.json({
        purchases
    })
})

module.exports = {
    userRouter: userRouter
}