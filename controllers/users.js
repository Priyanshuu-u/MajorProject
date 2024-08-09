const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");

module.exports.signup = wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Welcome to wanderlust");
        res.redirect("/listings");
      });
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
  })

module.exports.renderSignupForm =  (req, res) => {
    res.render("user/signup.ejs");
  }
module.exports.renderLoginForm = (req, res) => {
    res.render("user/login.ejs");
  }
module.exports.login =  async (req, res) => {
    req.flash("success", "Welcome back to WanderLust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }
  module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      req.flash("success", "You are logged out now");
      res.redirect("/listings");
    });
  }