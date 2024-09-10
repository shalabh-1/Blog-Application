const {Router, response, request}=require("express")
const User=require("../model/user")
const router=Router();



        router.get("/signin",(request,response)=>{

            return response.render("signin")
        })
        
        router.get("/signup",(request,response)=>{

            return response.render("signup")
        })

        router.post("/signup", async(request,response)=>{

            const {fullName,email,password}=request.body
            if(!fullName || !email || !password){
                return response.status(400).send("All fields are required.");
            }
                
                await User.create(
                    {
                    fullName,
                    email,
                    password                    
                }
            )
                

                return response.redirect("/")
        })

        router.get('/signin',async(request,response)=>{

            response.render("signin")
        })

        router.post('/signin',async(request,response)=>{
              
            try{
                const {email,password}=request.body
                const token= await User.matchPasswordAndGenrateToken(email,password)
                // console.log(token)
                return response.cookie("token",token).redirect("/")

            }catch(error){

                return response.render("signin",{
                    error:"Incorrect Email OR ID password"
                })
            }
                    
        })


        router.get("/logout",function(request,response){

            response.clearCookie("token").redirect("/")

        })

        



      
module.exports=router