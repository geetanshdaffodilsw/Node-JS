// import http from "http"
// import {b , c} from "./features.js"
const PORT = 5000;
// const server = http.createServer((req,res)=>{
//      res.end("Server Created")
// if (req.url==='/'){res.end("HEllo to home Page")}
//      else if(req.url === '/about'){
//           console.log("About Page")
//      }
//      else if(req.url === "/contact"){
//           console.log("Contact Page")
//      }
// })

// console.log("Hello")
// console.log(b+c)

// server.listen(PORT,(req,res)=>{
//      console.log(`LIstening to Port ${PORT}`)
// })

console.clear()
import path from "path";
import express from "express"
const server = express();
import mongoose from "mongoose"
import { stringify } from "querystring";
import cookieParser from "cookie-parser";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const url = 'mongodb+srv://geetanshsharma:sharma@cluster0.0kuxnxj.mongodb.net/Users?retryWrites=true&w=majority'
mongoose.connect(url)
     .then((result) => {
          console.log("Connected")
     }).catch((err) => { console.log(err) })

// const messageSchema = new mongoose.Schema({
//      name: String,
//      email: String,
// })


const userSchema = new mongoose.Schema({
     name: String,
     email: String,
     password: String,
})



const User = mongoose.model("User", userSchema)

// const users = []



// console.log(path.resolve())
// using middlewares
server.use(express.static(path.join(path.resolve(), "public")))
server.use(express.urlencoded({ extended: true }))
server.use(cookieParser())


server.set("view engine", "ejs")

const isAuthenticate = async (req, res, next) => {
     const { token } = req.cookies
     if (token) {
          const decoded = Jwt.verify(token, "hwjcxbhc")
          console.log(decoded)
          req.user = await User.findById(decoded._id)
          next();
     } else {
          res.redirect("/login");
     }
}
/*

server.get("/", (req, res) => {
     res.render("index")
})

server.get("/success", (req, res) => {
     res.render("success")
})
server.get("/add", async (req, res) => {
     await message.create({ name: "Abhi", email: "cbhds@sbcsjchcs.as" }).then(() => {
          res.send("Nice")
     })
})  */
server.get("/", isAuthenticate, (req, res) => {
     console.log(req.user.name)
     res.render("logout", { name: req.user.name })


})
server.get("/login",(req,res)=>{
     res.render("login")
})

server.get("/register", (req, res) => {
     res.render("register")
})


server.get("/logout", (req, res) => {
     res.cookie("token", null, {
          httpOnly: true, 
          expires: new Date(Date.now())
     })
     res.redirect("/")
})
server.post("/login", async (req, res) => {
     const { email, password } = req.body

     let user = await User.findOne({ email })
     console.log(user)
     if (!user) {
          console.log("1")
          res.redirect("/register")
          console.log("1")
     }
     
    else{
     const isMatch = await bcrypt.compare(password,user.password)

          if (isMatch){
               return res.render("/")
          }
          if (!isMatch){
               return res.render("login",{email,message:"Incorrect Password"})
          }
      const token = Jwt.sign({ _id: user._id }, "hwjcxbhc")
     // console.log(token)
     res.cookie("token", token, {
          httpOnly: true, 
          expires: new Date(Date.now() + 6 * 1000)
     });
     res.redirect("/")
    }

    
})
server.post("/register", async (req, res) => {
     const { name, email, password } = req.body

     let user = await User.findOne({ email })
     console.log(user+"register")
     if (user) {
          return res.redirect("/login")
          // return console.log("Register First")
     }
     const hashedPassword = await bcrypt.hash(password,10)
     user = await User.create({
          name, email,
          password: hashedPassword,
     })

     const token = Jwt.sign({ _id: user._id }, "hwjcxbhc")
     // console.log(token)
     res.cookie("token", token, {
          httpOnly: true, expires: new Date(Date.now() + 6 * 1000)
     })
     res.redirect("/")
})






























/*
server.post("/contact", async (req, res) => {
     // console.log(req.body)
     const { name, email } = req.body
     // const messageData = ;
     await message.create({ name, email })
     // res.render("index")
     console.log(users)

     res.redirect("/success")
})
server.get("/users", (req, res) => {
     res.json({ users, })
})

*/

server.listen(PORT, () => {
     console.log(`Listening to port number ${PORT}`)
})
