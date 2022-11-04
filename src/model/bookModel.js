const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;

const bookSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        require: true,
        trim: true
    },
    title: {
        type: String,
        require: true,
        unique: true,
        trim: true
    },
    bookPrice: {
        type: String,
        require: true,
        trim: true
    },
    authorName: {
        type: String,
        require: true,
        trim: true
    },
    issued: {
        type: Number,
        default: 0
    },
    totalBooks: {
        type: Number,
        default: 5000 
    },
    deletedAt: {
        type: Date,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
},
    { timestamps: true }
);

module.exports = mongoose.model("bookDb", bookSchema)