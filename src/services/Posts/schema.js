const { Schema } = require("mongoose")
const mongoose = require("mongoose")
const v = require("validator")


const PostSchema = new Schema({
  text: {
    type: String,
    required: true,
    validate(value) {
      if (value.length < 3) {
        throw new Error("Text has to have at least 3 characters!")
      }
    },
  },
  
  user: Object,
  username:{
    type:String,
    unique: true,
  },
  image: String,
  updatedAt: String,
  createdAt: String,
})

const PostModel = mongoose.model("posts", PostSchema)


module.exports = PostModel