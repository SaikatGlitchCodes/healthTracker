const isAuthenticatedRoute = (req,res,next)=>{
    if(req.isAuthenticated()){
        return next()
    }else{
        res.status(401).json({message: "Please sign In"})
    } 
}

module.exports = isAuthenticatedRoute;