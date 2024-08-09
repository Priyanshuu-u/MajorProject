const express = require("express")
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js")
const { listingSchema, reviewSchema } = require("../schema.js")
const ExpressError = require("../utils/ExpressError.js")
const Listing = require("../models/listing.js")
const Review = require("../models/review.js");
const { isLoggedIn, isReviewauthor } = require("../middlewares/middleware.js");
const { createReview, destroyReview } = require("../controllers/reviews.js");


const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg)
    }

    else {
        next();
    }

}
router.post("/", isLoggedIn,validateReview, createReview)
router.delete("/:reviewId",isLoggedIn,isReviewauthor, destroyReview)

module.exports = router;