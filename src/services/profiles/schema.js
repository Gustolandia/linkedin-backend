const { Schema } = require("mongoose")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const v = require("validator")


const ProfileSchema = new Schema({
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
  password: {
    type: String,
    required: true,
    minlength: 7,
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
  refreshTokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
},
{ timestamps: true }
)

ProfileSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.__v

  return userObject
}

ProfileSchema.statics.findByCredentials = async (email, password) => {
  const user = await ProfileModel.findOne({ email })
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    const err = new Error("Unable to login")
    err.httpStatusCode = 401
    throw err
  }

  return user
}

ProfileSchema.pre("save", async function (next) {
  const user = this

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

ProfileSchema.post("validate", function (error, doc, next) {
  if (error) {
    error.httpStatusCode = 400
    next(error)
  } else {
    next()
  }
})

ProfileSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    error.httpStatusCode = 400
    next(error)
  } else {
    next()
  }
})

const ProfileModel = mongoose.model("profiles", ProfileSchema)

module.exports = ProfileModel