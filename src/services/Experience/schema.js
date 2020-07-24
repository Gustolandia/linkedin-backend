const { Schema } = require("mongoose")
const mongoose = require("mongoose")
const v = require("validator")


const ExperienceSchema = new Schema({
  role: {
    type: String,
    required: true,
    validate(value) {
      if (value.length < 2) {
        throw new Error("Name has to have at least 2 characters!")
      }
    },
  },
  company: {
    type: String,
    required: true,
    validate(value) {
      if (value.length < 3) {
        throw new Error("Company has to have at least 3 characters!")
      }
    },
  },
  startDate: {
    type: String,
    required: true,
    lowercase: true,
    // validate: {
    //   validator: async (value) => {
    //     if (!v.isDate(value)) {
    //       throw new Error("Start date is invalid")
    //     } 
    //   },
    // },
  },
  endDate: {
    type: String,
    lowercase: true,
    // validate: {
    //   validator: async (value) => {
    //     if (!(v.isDate(value)||value==null)) {
    //       throw new Error("End date is invalid")
    //     } 
    //   },
    // },
  },
  description: {
    type: String,
    required: true,
    validate(value) {
      if (value.length < 3) {
        throw new Error("Description has to have at least 3 characters!")
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
  username:String,
  image: String,
  updatedAt: String,
  createdAt: String,
})

const ExperienceModel = mongoose.model("experiences", ExperienceSchema)


module.exports = ExperienceModel