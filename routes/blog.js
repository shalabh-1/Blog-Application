

const {Router}=require("express")
const router=Router();
const multer  = require('multer')
const path=require("path");
const Blog = require("../model/blog");
const Comment=require("../model/comment")
const storage = multer.diskStorage({

    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads`))
    },

    filename: function (req, file, cb) {
        console.log(file)
      const fileName=`${Date.now()}-${file.originalname}`
      cb(null, fileName)
    }
  })

  const upload = multer({ storage: storage })

router.get("/addnew",(request,response)=>{
    response.render("addblog",{
        user:request.user
    })
})


router.post("/", upload.single('coverImage'),async(request,response)=>{

    console.log(request.file)
  const blog= await Blog.create({
    title:request.body.title,
    content:request.body.content,
    coverImage:`/uploads/${request.file.filename}`,
    createdBy:request.user._id
   })

   response.redirect(`/blog/${blog._id}`);



})

router.get("/:id",async(request,response)=>{

const blog=await Blog.findById(request.params.id).populate("createdBy")
console.log(blog)
const comments=await Comment.find( {blogId:request.params.id}).populate("createdBy")
console.log(comments)

return response.render("blog",{
  user:request.user,
  blog,
  comments
})
})


router.post("/comment/:blogId",async(request,response)=>{

  await Comment.create({
  
  content:request.body.content,
  createdBy:request.user._id,
  blogId:request.params.blogId
})

return response.redirect(`/blog/${request.params.blogId}`)
})

module.exports=router

