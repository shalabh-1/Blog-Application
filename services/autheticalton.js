const JWT=require("jsonwebtoken")

const secret="$supenMan@123";


function createTokenforUser(user){

    return JWT.sign({
        _id:user._id,
        email:user.email,
        profileImageURL:user. profileImageURL,
        role:user.role
 },secret)

//  
}


function validateToken(token){
    return JWT.verify(token,secret)
}

module.exports={
createTokenforUser,validateToken
}