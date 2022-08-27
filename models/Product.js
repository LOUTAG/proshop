const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema(
    {
        _id: Schema.Types.ObjectId,
        name:{
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        brand: {
            type: String,
            required: true
        },
        category: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Category'
        },
        description: {
            type: String,
            required: true
        },
        rating:{
            type: Number,
            default: null
        },
        numbReviews:{
            type: Number,
            default: 0
        },
        reviews:{
            type:[
                {
                    type: Schema.Types.ObjectId,
                    ref: 'Review'
                }
            ]
        },
        price:{
            type: Number,
            required: true
        },
        countInStock:{
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;