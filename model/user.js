
const {Schema,model}= mongoose=require("mongoose")
const { createHmac,randomBytes } = require('crypto');
const {createTokenforUser,validateToken}=require('../services/autheticalton')
const userSchema=new Schema({

    fullName:{
        type:String,
        required:true,
    }
    ,
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
       
    },
    salt:{
        type:String,
      
       
    },

   
    role:{
        type:String,
        enum:["USER","ADMIN"],
        default:"USER"
    },

    profileImageURL:{
        type:String,
        default:"/public/default.jpeg",
    }


},{timestamps:true})





userSchema.pre("save",function(next){
    // user refers to the current document
    const user=this;
    if(!this.isModified("password")){
       return  next()
    }

        // randomBytes(16) CREATES BUFFER with 16 digits and convert it into string
        // so now it creates a random string or secret key
    const salt=randomBytes(16).toString();
    const hash = createHmac('sha256', salt)
               .update(user.password)
               .digest('hex');

               this.salt=salt
               this.password=hash
               next()

})


userSchema.static("matchPasswordAndGenrateToken",async function(email,password){

    // this refers to the collection or  table name
    
    const user=await this.findOne({email})
    if(!user){
         throw new Error("User Not Found");
    }

    const salt=user.salt;

    const hashedPassword=user.password 
    const userprovidedHash = createHmac('sha256', salt)
               .update(password)
               .digest('hex');

               if(hashedPassword!=userprovidedHash){
                throw new Error("Incorrect Password");
               }

            //    return {...user._doc,password:undefined,salt:undefined}

            
            const token=createTokenforUser(user)
            return token

})




const User=model("user",userSchema);
module.exports=User;

