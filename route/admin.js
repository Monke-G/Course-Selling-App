const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z, regex } = require("zod");
const { adminModel } = require("../db");

const adminRouter = Router();

const JWT_ADMIN_PASSWORD = "admin-potahtoo";

adminRouter.post("/signup", async function (req, res) {
  const requiredBody = z.object({
    email: z.string().min(3).max(100).email(),
    password: z.string().min(3).max(30).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/).regex(/[^A-Za-z0-9]/),
    firstName: z.string().min(3).max(50),
    lastName: z.string().min(3).max(50),
  });

  const parsedData = requiredBody.safeParse(req.body);

  if(!parsedData.success) {
    res.json({
      message: "Incorrect format",
      error: parsedData.error
    })
    return
  }

  const { email, password, firstName, lastName } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  await adminModel.create({
    email,
    password: hashedPassword,
    firstName,
    lastName,
  })
  
  res.json({
    message: "You are logged in",
  });
});

adminRouter.post("/signin", async function (req, res) {
  const { email, password } = req.body;

  const admin = await adminModel.findOne({
    email,
  })
  
  if(!user) {
    res.status(403).json({
      message: "User doesn't exist in our database"
    })
    return
  }

  const passwordMatch = await bcrypt.compare(password, admin.password);

  if (passwordMatch) {
    const token = jwt.sign(
      {
        id: admin._id,
      },
      JWT_ADMIN_PASSWORD,
    );
    res.json({
      token,
    })
  } else {
    res.status(403).json({
      message: "Incorrect credentials",
    });
  }
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