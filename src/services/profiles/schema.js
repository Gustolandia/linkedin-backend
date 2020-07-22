const { Schema } = require("mongoose")
const mongoose = require("mongoose")
const v = require("validator")


const ProjectSchema = new Schema({
  name: {
    type: String,
    required: true,
    validate(value) {
      if (value.length < 3) {
        throw new Error("Name has to have at least 3 characters!")
      }
    },
  },
  surname: {
    type: String,
    required: true,
    validate(value) {
      if (value.length < 3) {
        throw new Error("Surname has to have at least 3 characters!")
      }
    },
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    validate: {
      validator: async (value) => {
        if (!v.isEmail(value)) {
          throw new Error("Email is invalid")
        } 
      },
    },
  },
  bio: {
    type: String,
    required: true,
    validate(value) {
      if (value.length < 3) {
        throw new Error("Bio has to have at least 3 characters!")
      }
    },
  },
  title: {
    type: String,
    required: true,
    validate(value) {
      if (value.length < 2) {
        throw new Error("Title has to have at least 2 characters!")
      }
    },
  },
  area: {
    type: String,
    required: true,
    validate(value) {
      if (value.length < 3) {
        throw new Error("Area has to have at least 3 characters!")
      }
    },
  },
  username:{
    type:String,
    unique: true,
  },
  image: String,
  updatedAt: String,
  createdAt: String,
})

const ProjectModel = mongoose.model("projects", ProjectSchema)


module.exports = ProjectModel