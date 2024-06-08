const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Course = require("../Academy Website/models/course");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { courseSchema } = require("./schema.js");

const DB_URL = "mongodb://127.0.0.1:27017/academy";

main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(DB_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
  res.render("courses/home.ejs");
});

const validateCourse = (req, res, next) => {
  let { error } = courseSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

app.get(
  "/courses",
  wrapAsync(async (req, res) => {
    const courses = await Course.find({});
    res.render("courses/courses.ejs", { courses });
  })
);

app.get("/courses/new", (req, res) => {
  res.render("courses/newcourse.ejs");
});

app.get(
  "/courses/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const course = await Course.findById(id);
    res.render("courses/showcourse.ejs", { course });
  })
);

app.post(
  "/courses",
  validateCourse,
  wrapAsync(async (req, res) => {
    const newCourse = new Course(req.body.course);
    await newCourse.save();
    res.redirect("/courses");
  })
);

app.get(
  "/courses/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const course = await Course.findById(id);
    res.render("courses/editcourse.ejs", { course });
  })
);

app.put(
  "/courses/:id",
  validateCourse,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Course.findByIdAndUpdate(id, { ...req.body.course });
    res.redirect(`/courses/${id}`);
  })
);

app.delete(
  "/courses/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedCourse = await Course.findByIdAndDelete(id);
    console.log(deletedCourse);
    res.redirect("/courses");
  })
);

app.get("/vision", (req, res) => {
  res.render("courses/vision.ejs");
});

app.get("/mission", (req, res) => {
  res.render("courses/mission.ejs");
});

// app.get("/test", async (req, res) => {
//   let sampleCourse = new Course({
//     title: "New Course",
//     description: "New course freshly launched!",
//     requirement: "No requirement",
//     content: "Sample content",
//     price: 9999,
//   });
//   await sampleCourse.save();
//   console.log("course created!");
//   res.send("successful!");
// });

// app.get("/register", (req, res) => {
//   res.send("register here!");
// });

// app.get("/aboutus", (req, res) => {
//   res.send("about us here");
// });

// app.get("/ourvision", (req, res) => {
//   res.send("our vision here");
// });

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
  // res.send("something went wrong!");
});

app.listen(8080, () => {
  console.log("listening to port 8080");
});
