// Require External Dependencies
const express = require("express");
const router = express.Router({ mergeParams: true });

// Require Local Dependencies
const { isLoggedIn, isRatingAuthor } = require("../middleware");
const ratings = require("../controllers/ratings");

// Run the createRating method when sending a POST request to the '/ratings/' route
router.post("/", ratings.createRating);

// Upon sending a DELETE request to the '/ratings/:ratingId' route, verify that the user is logged in and has permission to delete the specified rating (i.e., they're the original author or an admin account) and, if both of these conditions are true, run the deleteRating method.
router.delete("/:ratingId", isLoggedIn, isRatingAuthor, ratings.deleteRating);

// Export Routes
module.exports = router;
