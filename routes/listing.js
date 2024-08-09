const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner } = require("../middlewares/middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

router
  .route("/")
  .get(wrapAsync(listingController.index))

  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    listingController.createListing
  );
// .post(upload.single('listing[image]'),(req,res)=>{
//   res.send(req.file);
// })
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(
    // isOwner,
    listingController.showListing
  )
  .put(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    listingController.updateListing
  )
  .delete(isLoggedIn, listingController.destroyListing);

router.get("/:id/edit", isLoggedIn, isOwner, listingController.renderEditForm);

module.exports = router;
