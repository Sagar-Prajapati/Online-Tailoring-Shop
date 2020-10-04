module.exports = (req,res,next)=>{
    const email = req.body.email;

    if(email=="sagar72029@gmail.com")
            {
                return res.render('userEjs/userSignup',{
                    pageTitle:'Signup',
                    path:'/getSignup',
                    errorMessage:'This Email cannot be Used'
                });
            }
    next();
}