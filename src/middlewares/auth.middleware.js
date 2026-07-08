const authMiddleware = (req,res,next) => {

    const authHeader  = req.header("Authorization")
    if(!authHeader){
        return res.status(401).json(
            {
                message: "Authorization header is missing"
            }
        )
    }
    const [scheme, token] = authHeader.split(" ")
    if(scheme !== "Bearer" || !token){
        return res.status(401).json({
            message: "Invalid authorization header format"
        })
    }

    req.token = token
    next()
}
export default authMiddleware