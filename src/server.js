const express = require("express")
const listEndpoints = require("express-list-endpoints")
const profilesRoutes = require("./services/profiles")
const postsRoutes = require("./services/Posts")

const cors = require("cors")
const path = require("path"); 
const mongoose = require("mongoose")
const helmet = require("helmet")





const {
  notFoundHandler,
  unauthorizedHandler,
  forbiddenHandler,
  catchAllHandler,
} = require("./errorHandling")


const server = express()

const port = process.env.PORT || 3004

server.use(cors())

const loggerMiddleware = (req, res, next) => {
  console.log(`Logged ${req.url} ${req.method} -- ${new Date()}`)
  next()
}

const publicFolderPath = path.join(__dirname, "./public")
console.log(publicFolderPath)
server.use(express.static(publicFolderPath));
server.use(express.json()); // parse the bodies when they are in json format

server.use(loggerMiddleware);

server.use("/profile", profilesRoutes)
server.use("/posts", postsRoutes)




server.use(notFoundHandler)
server.use(unauthorizedHandler)
server.use(forbiddenHandler)
server.use(catchAllHandler)

console.log(listEndpoints(server))

mongoose
  .connect("mongodb://localhost:27017/strive", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(
    server.listen(port, () => {
      console.log("Running on port", port)
    })
  )
  .catch((err) => console.log(err))