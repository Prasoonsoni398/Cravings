import jwt from "jsonwebtoken";

export const genToken = async (user, res) => {
  try {
    const payload = { id: user._id };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    if (res) {
      const cookieOptions = {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      };

      res.cookie("Cravings", token, cookieOptions);

      if (user.userType === "restaurant") {
        res.cookie("Oreo", token, cookieOptions);
      }
    }
  } catch (error) {
    throw error;
  }
};

export const genOTPToken = async (user, res) => {
  try {
    const payload = { id: user._id };

    const token = await jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    res.cookie("kitkat", token, {
      maxAge: 1000 * 60 * 10,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    console.log(token);
  } catch (error) {
    throw next(error);
  }
};