//User:
//  ├── username
//  ├── email
//  ├── password
//  ├── avatar
//  ├── refreshToken
//  └── timestamps

import mongoose, { Schema } from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    fullname: {
        type: String,
        trim: true
    },
    username: {
        type : String,
        required: true,
        unique: true,
        lowercase: true,
        trim : true,
        index: true
    },
    email : {
        type: String,
        required : true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password : {
        type:  String,
        required:[true, "Password is required"]
    },
    avatar :{
        type: String,
    },
    coverImage: {
        type: String,
    },
    refreshToken: {
        type: String,
    },
    accessToken:{
        type: String,
    }
},{timestamps : true})

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }

    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordMatch = async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this.id,
            username: this.username,
            email: this.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "2d"}
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id: this.id,
    },
process.env.REFRESH_TOKEN_SECRET,
{expiresIn: "7d"})
}
const User = mongoose.model("User", userSchema)

export default User