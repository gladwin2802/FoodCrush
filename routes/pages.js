const express = require("express");
const router = express.Router();

router.get("/",(req,res)=>{
    res.render("login.hbs");
});

router.get("/login",(req,res)=>{
    res.render("login.hbs");
});

router.get("/register",(req,res)=>{
    res.render("register.hbs");
});

module.exports = router;