const express = require("express");
const app = express();
const mongoose = require("mongoose");
const shortId=require("shortid");


mongoose.connect('mongodb+srv://admin-Mukul:mukul@25@cluster0.nypaz.mongodb.net/UrlShortner', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => console.log(err))
app.use(express.urlencoded({extended: false}))
const shortUrlSchema = new mongoose.Schema({
    full:{
        type:String,
        required: true
    },
    short:{
        type:String,
        required: true,
        default:shortId.generate
    },
    clicks:{
        type: Number,
        required:true,
        default:0
    }
})
const ShortUrl = mongoose.model("ShortUrl",shortUrlSchema)
app.set("view engine", "ejs");

app.get("/",async (req,res) => {
    const shortUrls= await ShortUrl.find()
    res.render("index",{shortUrls:shortUrls});
})
app.post("/",async (req,res) =>{
    await ShortUrl.create({full:req.body.fullUrl})
    res.redirect("/")
})
app.get("/:shortUrl",async (req,res)=>{
    const shortUrl = await ShortUrl.findOne({short:req.params.shortUrl})
    if(shortUrl==null) return res.sendStatus(404)
    shortUrl.clicks++
    shortUrl.save()
    res.redirect(shortUrl.full)
})
app.listen((process.env.PORT || 3000),() => {
    console.log("Server started on port 3000");
});
