
const Listing  = require("../models/listing");
const Review  = require("../models/review");

module.exports.createReview = async (req, res) => {//cutted the common part /listings/:id/review 
    let listing = await Listing.findById(req.params.id);// to access id
    let newReview = new Review(req.body.review);// Create a new review
    newReview.author = req.user._id;//storing review author in db
    listing.reviews.push(newReview);// Add the review to the listing's reviews array
 
    await newReview.save();// Save the new review and the listing
    await listing.save();
    req.flash("success", "New Review Created!");

    res.redirect("/listings");
};

module.exports.destroyReview = async (req, res) => {//cutted the common part /listings/:id/review 
    let {id, reviewId} =  req.params;

    await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");

    res.redirect(`/listings/${id}`);
};