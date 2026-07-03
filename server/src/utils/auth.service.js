import jwt from "jsonwebtoken"

export const genToken = async (user)=>{
    try {
        const payload = {
            id: user._id,
            email:user.email
        }
        const token = await jwt.sign(payload,process.env.JWT_Secret,{
            expiresIn : "1d",
        })
        res.cookie("Craving",token,{maxAge:1000*60*60*24,httpOnly:true,secure:false,sameSite:'lax'})
    } catch (error) {
        throw next(error)
    }
}

