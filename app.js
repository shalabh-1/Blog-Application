require('dotenv').config()
const express=require("express")
const app=express();
const path=require("path");
// export PORT 3456
const PORT=8000 || process.env.PORT
const userRoute=require("./routes/user.js");
const blogRoute=require("./routes/blog.js");
const { default: mongoose } = require("mongoose");
const cookieParser = require('cookie-parser');
const {checkForAuthenticationCookie}=require('./middleware/authentcation.js')
const Blog=require("./model/blog.js")
app.use(cookieParser());
app.set("view engine","ejs")
app.set("views",path.resolve("./views"))

app.use(express.static(path.resolve("./public/")))

app.use(express.urlencoded({extended:"false"}))
mongoose.connect(process.env.MONGO_URL).then((e)=>{
    console.log("Mongodb Connected")
}).catch((e)=>{
    console.log("Not Connected")
})

app.use(checkForAuthenticationCookie("token"))


app.get("/",async(request,response)=>{

   const allBlogs=await Blog.find({});
    return response.render("home",{
        user:request.user,
        blogs:allBlogs
        })
})


app.use("/blog",blogRoute)
app.use("/user",userRoute)
app.listen(PORT,()=>console.log("Server is Created"))

