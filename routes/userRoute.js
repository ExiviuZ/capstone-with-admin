const express = require("express");
const router = express.Router();
const { notLoggedIn, loggedIn, notUser } = require("../middleware");
const { catchAsync } = require("../utils/errorHandler");
const User = require("../model/user");
const passport = require("passport");

router.post(
  "/register",
  catchAsync(async (req, res, next) => {
    try {
      const {
        firstName,
        lastName,
        email,
        username,
        street,
        city,
        province,
        password,
      } = req.body;
      const user = new User({
        firstName,
        lastName,
        email,
        username: username,
        address: {
          street,
          city,
          province,
        },
      });

      const registeredUser = await User.register(user, password);
      await user.save();
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        } else {
          req.flash("success", "Welcome To Your Dashboard!");
          res.redirect(`/user/profile`);
        }
      });
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/user/register");
    }
  })
);

router.post(
  "/login",
  (req, res, next) => {
    req.body.username = req.body.username.toLowerCase();
    next();
  },
  passport.authenticate("user", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  async (req, res) => {
    req.flash("success", "Welcome Back!");
    res.redirect("/user/profile");
  }
);

router.get("/profile", notLoggedIn, notUser, async (req, res) => {
  console.log(req.user);
  res.render("user/profile", { title: "Profile || Barangay Mag-Asawang Sapa" });
});

router.get("/census", notLoggedIn, notUser, async (req, res) => {
  console.log(req.user);
  res.render("user/community", {
    title: "Census || Barangay Mag-Asawang Sapa",
  });
});

router.get("/community", notLoggedIn, notUser, async (req, res) => {
  console.log(req.user);
  res.render("user/community", {
    title: "Community || Barangay Mag-Asawang Sapa",
  });
});

module.exports = router;
