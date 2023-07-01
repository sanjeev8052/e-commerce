const mongoose = require("mongoose")

const prodctSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Product Name"]
    },
    description: {
        type: String,
        required: [true, "Please Enter Product Description"]
    },
    price: {
        type: Number,
        required: [true, "Please Enter Product Price"],
        maxLength: [8, "Price Can Not Exceed 8 Characters"]
    },
    ratings: {
        type: String,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true,
            }
        },
        {
            url: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: [true, " Please Enter Product Category"]
    },
    stock: {
        type: String,
        required: [true, " Please Enter Product Stock"],
        maxLength: [4, " Stock Can Not Exceed 4 Characters"],
        default: 1
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: String,
                required: true
            },
            comment: {
                type: String,
                required: true
            }

        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now
    }

})


const Product = mongoose.model("Product", prodctSchema);
module.exports = Product