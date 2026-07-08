import mongoose from 'mongoose'

const likeSchema = new mongoose.Schema(
    {
        owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        post:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Post",
            required:true
        }
    },{timestamps:true}
)

likeSchema.index(
    {
        owner:1,
        post:1
    },
    {
        unique:true
    }
)

const Like = mongoose.model('Like',likeSchema)

export default Like