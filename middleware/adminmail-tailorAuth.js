module.exports = (req,res,next)=>{
    const emailT = req.body.email||req.body.your_email;

    if(emailT=="sagar72029@gmail.com")
            {
                return res.render('tailorsEjs/tailorSignup',{
                    pageTitle:'Signup',
                    path:'/tailor/signup',
                    errorMessage:'This Email is Already Registered with Us.',
                    updateMessage:null
                });
            }
    next();
}