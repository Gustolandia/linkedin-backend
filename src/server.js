const express = require("express")
const listEndpoints = require("express-list-endpoints")
const profilesRoutes = require("./services/profiles")
const postsRoutes = require("./services/Posts")

const cors = require("cors");
const path = require("path"); 
const mongoose = require("mongoose");
const helmet = require("helmet");
var cloudinary = require('cloudinary').v2;




cloudinary.config({ 
  cloud_name: 'gustolandia', 
  api_key: '938746943738123', 
  api_secret: 'Od8RbciQ1iLNRK6PL29edIp8CTI' 
});


const {
  notFoundHandler,
  unauthorizedHandler,
  forbiddenHandler,
  catchAllHandler,
} = require("./errorHandling")


const server = express()



server.use(cors())

const port = process.env.PORT;

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
//MONGODB does not put the name of the DB in between / and ? so you have to put it yourself!!!!!
mongoose
  .connect("mongodb+srv://Gustolandia:Secreta23@linkedin.9vrgm.mongodb.net/<dbname>?retryWrites=true&w=majority", { 
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