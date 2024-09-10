const {validateToken}=require('../services/autheticalton')
function checkForAuthenticationCookie(cookieName){
    return function(request,response,next){

        const tokenCookieValue=request.cookies?.[cookieName]
       
        if(!tokenCookieValue){
           return  next();
        }
      


        try{
            const userpayload=validateToken(tokenCookieValue)
        
           
            request.user=userpayload
        }catch(error){
            console.log(error)      
        }

            // console.log(request.user)
        
        
        return next();

    }
}


module.exports={checkForAuthenticationCookie};