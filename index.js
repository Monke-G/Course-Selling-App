const express = require("express");
const mongoose = require ("mongoose");

const { userRouter } = require("./route/user");
const { courseRouter } = require("./route/course");
const { adminRouter } = require("./route/admin");

const app = express();

app.use(express.json());

app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/course", courseRouter);

async function main() {
    await mongoose.connect("course-selling-app");
    app.listen(3000);
}

main();