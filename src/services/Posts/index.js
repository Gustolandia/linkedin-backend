const express = require("express")
const PostSchema = require("./schema")
const ProfileSchema = require("../profiles/schema")
const q2m = require("query-to-mongo")
var auth = require('basic-auth')
const multer = require("multer")
const path = require("path");
const { writeFile, createReadStream } = require("fs-extra")
const { authorize } = require("../middlewares/authorize")





const { check, validationResult } = require("express-validator")

const router = express.Router()

const upload = multer({})

const postsFolderPath = path.join(__dirname, "../../public")


router.get("/:postId", authorize, async (req, res, next) => {
  try {
    
    const postId = req.params.postId
    const post = await PostSchema.find({_id:postId})
    if (post) {
      res.send(post)
    } else {
      const error = new Error()
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    console.log(error)
    next("While reading post list a problem occurred!")
  }
})


router.post("/:postId/picture", authorize, upload.any("picture"), async (req, res, next) => {

  try {
    const veri = await PostSchema.findById(req.params.postId)
    if (veri.username==auth(req).name){
    await writeFile(
      path.join(postsFolderPath, req.files[0].originalname),
      req.files[0].buffer
    )
    let user2 = await cloudinary.uploader.upload(path.join(profilesFolderPath, req.files[0].originalname), function(error, result) {});

    const user = await PostSchema.findOneAndUpdate({ _id: req.params.postId }, {image:user2.url, updatedAt: new Date()})

    if (user) {
      res.send("Ok")
    } else {
      const error = new Error(`User with postId ${req.params.postId } not found`)
      error.httpStatusCode = 404
      next(error)
    }}
  } catch (error) {
    console.log(error)
    next(error)
  }
  res.send("ok")
})




router.get("/", authorize, async (req, res, next) => {

  try {

    const query = q2m(req.query)
    const posts = await PostSchema.find(query.criteria, query.options.fields)
    .skip(query.options.skip)
    .limit(query.options.limit)
    .sort(query.options.sort)

    res.status(201).send(posts)
  } catch (error) {
    next(error)
  }
})



router.post(
  "/",
  [
    check("text")
      .isLength({ min: 2 }).withMessage("At least 2 characters")
      .exists().withMessage("Insert a text please!"),
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
      const newPost = {
        ...req.body,
        username:auth(req).name,
        user: await ProfileSchema.find({username:auth(req).name}),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const newP2 = new PostSchema(newPost)
      const { _id } = await newP2.save()
    
      res.status(201).send(newP2)}
    } catch (error) {
      next(error)
    }
    })

router.put("/:postId",
[
  check("text")
    .isLength({ min: 2 }).withMessage("At least 2 characters")
    .exists().withMessage("Insert a text please!"),
],
async (req, res, next) => {
  try {
    console.log(req.body)
    const veri = await PostSchema.findById(req.params.postId)
    if (veri.username==auth(req).name){
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      let err = new Error()
      err.message = errors
      err.httpStatusCode = 400
      next(err)
    }
    else{
      const newPost = {
        ...req.body,
        username:auth(req).name,
        user: await ProfileSchema.find({username:auth(req).name}),
        updatedAt: new Date(),
      }
      const post = await PostSchema.findOneAndUpdate({ _id: req.params.postId }, newPost)
      console.log(newPost)
      if (post) {
        res.send("Ok")
      } else {
        const error = new Error(`post with postId ${req.params.postId} not found`)
        error.httpStatusCode = 404
        next(error)
      }}

    }} catch(error){
      next(error);
    }
  })
  
  router.delete("/:postId", async (req, res, next) => {
    try {
      const veri = await PostSchema.findById(req.params.postId)
      if (veri.username==auth(req).name){
      const project = await PostSchema.findByIdAndDelete(req.params.postId)
      if (project) {
        res.send("Deleted")
      } else {
        const error = new Error(`post with id ${req.params.postId} not found`)
        error.httpStatusCode = 404
        next(error)
      }}
    } catch (error) {
      next(error)
    }
  })

module.exports = router