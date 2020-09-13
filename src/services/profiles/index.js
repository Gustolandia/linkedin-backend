const express = require("express")
const ProfileSchema = require("./schema")
const ExperienceSchema = require("../Experience/schema")
const q2m = require("query-to-mongo")
var auth = require('basic-auth')
const multer = require("multer")
const path = require("path");
const { writeFile, createReadStream } = require("fs-extra")
const { authenticate, refreshToken } = require("./authTools")
const { authorize } = require("../middlewares/authorize")





const { check, validationResult } = require("express-validator")

const router = express.Router()

const upload = multer({})

const profilesFolderPath = path.join(__dirname, "../../public")

router.get("/me", authorize , async (req, res, next) => {
  try {
    
    const username = auth(req).name
    const profile = await ProfileSchema.find({username:username})
    if (profile) {
      res.send(profile)
    } else {
      const error = new Error()
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    console.log(error)
    next("While reading profiles list a problem occurred!")
  }
})

router.get("/:username", authorize, async (req, res, next) => {
  try {
    
    const username = req.params.username
    const profile = await ProfileSchema.find({username:username})
    if (profile) {
      res.send(profile)
    } else {
      const error = new Error()
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    console.log(error)
    next("While reading profiles list a problem occurred!")
  }
})


router.post("/:username/picture", authorize, upload.any("picture"), async (req, res, next) => {
  console.log("mama")
  console.log(req.files)
  try {
    await writeFile(
      path.join(profilesFolderPath, req.files[0].originalname),
      req.files[0].buffer
    )
    const user = await ProfileSchema.findOneAndUpdate({ username: auth(req).name }, {image:req.files[0].originalname, updatedAt: new Date()})
    console.log(user)
    if (user) {
      res.send("Ok")
    } else {
      const error = new Error(`User with username ${auth(req).name} not found`)
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
  res.send("ok")
})

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await UserModel.findByCredentials(email, password)
    const tokens = await authenticate(user)
    res.send(tokens)
  } catch (error) {
    next(error)
  }
})

router.post("/logout", authorize, async (req, res, next) => {
  try {
    req.user.refreshTokens = req.user.refreshTokens.filter(
      (t) => t.token !== req.body.refreshToken
    )
    await req.user.save()
    res.send()
  } catch (err) {
    next(err)
  }
})

router.post("/logoutAll", authorize, async (req, res, next) => {
  try {
    req.user.refreshTokens = []
    await req.user.save()
    res.send()
  } catch (err) {
    next(err)
  }
})

router.post("/refreshToken", async (req, res, next) => {
  const oldRefreshToken = req.body.refreshToken
  if (!oldRefreshToken) {
    const err = new Error("Forbidden")
    err.httpStatusCode = 403
    next(err)
  } else {
    try {
      const newTokens = await refreshToken(oldRefreshToken)
      res.send(newTokens)
    } catch (error) {
      console.log(error)
      const err = new Error(error)
      err.httpStatusCode = 403
      next(err)
    }
  }
})


router.get("/", authorize ,async (req, res, next) => {
  console.log(auth(req).name)
  try {

    const query = q2m(req.query)
    const profiles = await ProfileSchema.find(query.criteria, query.options.fields)
    .skip(query.options.skip)
    .limit(query.options.limit)
    .sort(query.options.sort)

    res.send(profiles)
  } catch (error) {
    next(error)
  }
})



router.post(
  "/",
  [
    check("name")
      .isLength({ min: 2 }).withMessage("At least 2 characters")
      .exists().withMessage("Insert a name please!"),
      check("surname")
      .isLength({ min: 2 }).withMessage("At least 2 characters")
      .exists().withMessage("Insert a surname please!"),
      check("email")
      .isEmail().withMessage("Please insert an Email")
      .exists().withMessage("Insert a url please!"),
      check("bio")
      .isLength({ min: 2 }).withMessage("At least 2 characters")
      .exists().withMessage("Insert a bio please!"),
      check("title")
      .isLength({ min: 2 }).withMessage("At least 2 characters")
      .exists().withMessage("Insert a title please!"),
      check("area")
      .isLength({ min: 2 }).withMessage("At least 2 characters")
      .exists().withMessage("Insert an area please!"),
  ], 
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
    if (!errors.isEmpty()) {
      let err = new Error()
      err.message = errors
      err.httpStatusCode = 400
      next(err)
    }
    else{
      const newProfile = {
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
        username: auth(req).name,
      }
      const newP2 = new ProfileSchema(newProfile)
      const { username } = await newP2.save()
    
      res.status(201).send(username)}
    } catch (error) {
      next(error)
    }
    })

router.put("/",
[
  check("name")
    .isLength({ min: 2 }).withMessage("At least 2 characters")
    .exists().withMessage("Insert a name please!"),
    check("surname")
    .isLength({ min: 2 }).withMessage("At least 2 characters")
    .exists().withMessage("Insert a surname please!"),
    check("email")
    .isEmail().withMessage("Please insert an Email")
    .exists().withMessage("Insert a url please!"),
    check("bio")
    .isLength({ min: 2 }).withMessage("At least 2 characters")
    .exists().withMessage("Insert a bio please!"),
    check("title")
    .isLength({ min: 2 }).withMessage("At least 2 characters")
    .exists().withMessage("Insert a title please!"),
    check("area")
    .isLength({ min: 2 }).withMessage("At least 2 characters")
    .exists().withMessage("Insert an area please!"),
], authorize,
async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      let err = new Error()
      err.message = errors
      err.httpStatusCode = 400
      next(err)
    }
    else{
      const newProfile = {
        ...req.body,
        updatedAt: new Date(),
        username: auth(req).name,
      }
      const profile = await ProfileSchema.findOneAndUpdate({ username: auth(req).name }, newProfile)
      console.log(profile)
      if (profile) {
        res.send("Ok")
      } else {
        const error = new Error(`profile with username ${req.params.username} not found`)
        error.httpStatusCode = 404
        next(error)
      }

    }} catch(error){
      next(error);
    }
  })



  router.get("/:username/experiences", authorize, async (req, res, next) => {
    try {
      
      const username = req.params.username
      const profile = await ExperienceSchema.find({username:username})
      if (profile) {
        res.send(profile)
      } else {
        const error = new Error()
        error.httpStatusCode = 404
        next(error)
      }
    } catch (error) {
      console.log(error)
      next("While reading experiences list a problem occurred!")
    }
  })


  router.post("/:username/experiences/:expId/picture", authorize, upload.any("picture"), async (req, res, next) => {
    console.log("mama")
    console.log(req.files)
    try {
      if (req.params.username==auth(req).name){
        await writeFile(
          path.join(profilesFolderPath, req.files[0].originalname),
          req.files[0].buffer
        )
        const user = await ExperienceSchema.findOneAndUpdate({ _id: req.params.expId }, {image:"http:\\\\localhost:3004\\"+req.files[0].originalname, updatedAt: new Date()})
        console.log(user)
      
      if (user) {
        res.send("Ok")
      } else {
        const error = new Error(`User with username ${auth(req).name} not found`)
        error.httpStatusCode = 404
        next(error)
      }}
    } catch (error) {
      console.log(error)
      next(error)
    }
    res.send("ok")
  })
  

  router.post(
    "/:username/experiences",
    [
      check("role")
        .isLength({ min: 2 }).withMessage("At least 2 characters")
        .exists().withMessage("Insert a role please!"),
        check("company")
        .isLength({ min: 2 }).withMessage("At least 2 characters")
        .exists().withMessage("Insert a company please!"),
        check("startDate")
        .exists().withMessage("Insert a date please!"),
        check("description")
        .isLength({ min: 2 }).withMessage("At least 2 characters")
        .exists().withMessage("Insert a description please!"),
        check("area")
        .isLength({ min: 2 }).withMessage("At least 2 characters")
        .exists().withMessage("Insert an area please!"),
    ], authorize, 
    async (req, res, next) => {
      try {
        const errors = validationResult(req)
      if (!errors.isEmpty()) {
        let err = new Error()
        err.message = errors
        err.httpStatusCode = 400
        next(err)
      }
      else{
        const newProfile = {
          ...req.body,
          createdAt: new Date(),
          updatedAt: new Date(),
          username: auth(req).name,
        }
        const newP2 = new ExperienceSchema(newProfile)
        const { username } = await newP2.save()
        console.log(newP2)
        res.status(201).send(newP2)}
      } catch (error) {
        next(error)
      }
      })
  

module.exports = router