const express = require("express");
const router = express.Router({mergeParams: true});//merging with parent route + child
const wrapAsync = require("../Utils/wrapAsync.js");
const ExpressError = require("../Utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");

//Reviews Route//

//POST Review Route

 // Find the listing by ID
 router.post("/", isLoggedIn, validateReview, wrapAsync (reviewController.createReview));

//Delete Review Route//
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;