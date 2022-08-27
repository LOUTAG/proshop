const mongoose= require('mongoose');
const Schema= mongoose.Schema;

const reviewSchema = new Schema(
    {
        _id: Schema.Types.ObjectId,
        user: {
            type: Schema.Types.ObjectId,
            required: true
        },
        comment: {
            type: String,
            required: true
        },
        rating:{
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
)
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;