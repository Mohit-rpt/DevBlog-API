import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true, "Title is Required"],
        trim: true
    },
    content: {
        type:String,
        required: [true," Post content is required"]
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
        
    },
    category:{
    type:String,
    default:"General"
    },

        tags:[
        {
        type:String
        }
        ],
    thumbnail:{
        type:String
    },
    contentImages:[
        {
            type:String
        }
    ],

   views:{
   type:Number,
   default:0
   
}

},{timestamps: true})

const Post = mongoose.model('Post', postSchema)

export default Post