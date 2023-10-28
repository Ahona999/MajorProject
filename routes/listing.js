//ALL RELATED TO LISTING FUNCTIONALITY//
const express = require("express");
const router = express.Router();
const wrapAsync = require("../Utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");//from controllers
const multer = require("multer");
const {storage} = require("../cloudConfig.js");//storage for the time being
const upload = multer({ storage });// multer will extract the files from the form and save in cloudinary storage folder

router
.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn, 
    upload.single ("listing[image]"),
    validateListing,  
    wrapAsync(listingController.createListing)
    );

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn, isOwner, upload.single ("listing[image]"), validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.deleteListing));

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner,  wrapAsync(listingController.renderEdit));


module.exports = router;
