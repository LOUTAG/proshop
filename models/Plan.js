const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const planSchema = new Schema(
    {
        _id: Schema.Types.ObjectId,
        plan_id:{
            type: String,
            required: true
        },
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
        }
    },{
        timestamps: true,
      }
)

const Plan = mongoose.model('Plan', planSchema);

module.exports = Plan; 