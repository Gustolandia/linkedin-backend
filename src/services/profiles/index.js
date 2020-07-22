const express = require("express")
const ProfileSchema = require("./schema")
const q2m = require("query-to-mongo")
const authorization = require('sayso')


const { check, valusernameationResult } = require("express-validator")

const router = express.Router()


router.get("/:username", async (req, res, next) => {
  try {
    const username = req.params.username
    const profile = await ProfileSchema.findByusername(username)
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

router.get("/", async (req, res, next) => {
  try {
    const query = q2m(req.query)
    const profiles = await ProfileSchema.find(query.criteria, query.options.fields)
    .skip(query.options.skip)
    .limit(query.options.limit)
    .sort(query.options.sort)

    res.send({data:profiles, total:profiles.length})
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
      check("studentusername")
      .exists().withMessage("Needs student username")
  ],
  async (req, res, next) => {
    try {
      const errors = valusernameationResult(req)
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
      }
      const newP2 = new ProfileSchema(newProfile)
      const { _username } = await newP2.save()
    
      res.status(201).send(_username)}
    } catch (error) {
      next(error)
    }
    })



router.delete("/:username", async (req, res, next) => {
  try {
    const profile = await ProfileSchema.findByusernameAndDelete(req.params.username)
    if (profile) {
      res.send("Deleted")
    } else {
      const error = new Error(`profile with username ${req.params.username} not found`)
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    next(error)
  }
})

router.put("/:username",
  [
    check("name")
      .isLength({ min: 2 }).withMessage("At least 2 characters")
      .exists().withMessage("Insert a name please!"),
      check("description")
      .isLength({ min: 2 }).withMessage("At least 2 characters")
      .exists().withMessage("Insert a description please!"),
      check("url")
      .isURL().withMessage("Please insert a URL")
      .exists().withMessage("Insert a url please!"),
  ],
async (req, res, next) => {
  try {
    const errors = valusernameationResult(req)
    if (!errors.isEmpty()) {
      let err = new Error()
      err.message = errors
      err.httpStatusCode = 400
      next(err)
    }
    else{
      const profile = await ProfileSchema.findByusernameAndUpdate(req.params.username, req.body)
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

module.exports = router