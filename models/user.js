const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ObjectId } = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    Username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email");
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error("Password cannot include 'password'")
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    pic: {
        type: String,
        default:"https://res.cloudinary.com/smilingcloud/image/upload/v1595394323/noimage_b4umo7.png"
    },
    followers: [
        {
        type: ObjectId,
        ref: "User"
        }
    ],
    following: [
        {
        type: ObjectId,
        ref: "User"
        }
    ]
}, {
    timestamps: true
}
)

userSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id }, "pizza1234");
    this.tokens.push({ token });
    return token;
}

// Middlewares
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
})

// Creating a model
const User = mongoose.model('User', userSchema);

module.exports = User;
