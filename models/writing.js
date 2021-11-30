// Require Mongoose in order to interface with our MongoDB
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Require the Rating model because Writings have many Ratings
const Rating = require("./rating");

// Establish Writing Schema for MongoDB
// Note that the id field is automatically generated by MongoDB and does not need to be specified in the Schema
// Additionally, rather than specifying a ratingId field, the has-many relationship can be automatically handled by specifying the 'ratings' parameter in the Schema as an array of Ratings Schemas
const WritingSchema = new Schema({
    title: String,
    writingText: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    ratings: [
        {
            type: Schema.Types.ObjectId,
            ref: "Rating",
        },
    ],
});

// Writing Deletion Middleware
WritingSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Rating.remove({
            _id: {
                $in: doc.ratings,
            },
        });
    }
});

// Export WritingSchema
module.exports = mongoose.model("Writing", WritingSchema);
