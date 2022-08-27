const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriptionSchema = new Schema(
    {
        _id: Schema.Types.ObjectId,
        product_id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            require: true
        },
        description: {
            type: String,
            require: true
        },
        create_time: {
            type: String,
            require: true
        },
    }
)

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription; 