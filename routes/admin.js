const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z, regex } = require("zod");
const { adminModel, courseModel } = require("../db");
const { JWT_ADMIN_PASSWORD } = require("../config");
const { adminMiddleware } = require("../middleware/admin");

const adminRouter = Router();

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
  if (!admin) {
    res.status(403).json({
      message: "Admin doesn't exist in our database"
    });
    return;
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

adminRouter.post("/course", adminMiddleware, async function (req, res) {
  const adminId = req.adminId;
  const { title, description, imageUrl, price } = req.body;
  
  const course = await courseModel.create({
    title,
    description,
    imageUrl,
    price,
    creatorId: adminId
  });

  res.json({
    message: "course created",
    courseId: course._id
  });
});

adminRouter.put("/course", adminMiddleware, async function (req, res) {
  const adminId = req.adminId;

  const { title, description, imageUrl, price, courseId } = req.body;

  const course = await courseModel.findOne({
    _id: courseId,
    creatorId: adminId,
  });

  if (!course) {
    res.status(404).json({
      message: "The course linked to the user doesn't exist in our database",
    });
    return;
  }

  await courseModel.updateOne({
    _id: courseId,
    creatorId: adminId
  }, {
    title,
    description,
    imageUrl,
    price
  })

  res.json({
    message: "Course updated",
    courseId: course._id
  });
});

adminRouter.get("/course/bulk", adminMiddleware, async function (req, res) {
  const adminId = req.adminId;

  const courses = await courseModel.find({
    creatorId: adminId
  });

  res.json({
    message: "Course presented",
    courses
  }); 
});

module.exports = {
    adminRouter: adminRouter
}