
// require('dotenv').config()
// updated to hashing technique
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
const encrypt = require('mongoose-encryption');
const md5 = require("md5")


const app =express()



app.use(express.static("public"))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended:true}))
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true})


const userSchema =new mongoose.Schema({
    email:String, 
    password:String
})

// userSchema.plugin(encrypt, { secret: process.env.SECRET ,encryptedFields:['password']} );
// this is the old encruption technique used to store the passwords of user

const User = new mongoose.model("User", userSchema)


app.get("/", function(req, res){
    res.render("home")
})
app.get("/register", function(req, res){
    res.render("register")
})
app.get("/login", function(req, res){
    res.render("login")
})


app.post("/register", function(req, res){
    const newUser= new User({
        email:req.body.username, 
        password:md5(req.body.password)
    })
    newUser.save(function(err){
        if(err){
            console.log(err)

        }
        else{
            res.render("secrets")
        }
    })
})


app.post("/login", function(req, res){
    const username = req.body.username
    const pass =md5(req.body.password)
    
    User.findOne({email:username},function(err, userFound){
        if(err){
            console.log(err)
        }else{
            if(userFound){
                if(userFound.password===pass){
                    res.render("secrets")
                }
            }
        }
    })
})



























app.listen(3000, function(){
    console.log("The server is up and running on port 3000.")
})