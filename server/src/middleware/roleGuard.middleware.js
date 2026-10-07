export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      const error = new Error("Authentication required");
      error.statusCode = 401;
      return next(error);
    }

    if (!roles.includes(req.user.userType)) {
      const error = new Error(
        `Access denied. Requires one of [${roles.join(", ")}] permissions, but user is [${req.user.userType}]`
      );
      error.statusCode = 403;
      return next(error);
    }

    next();
  };
};

export const adminOnly = requireRole("admin");
export const riderOnly = requireRole("rider");
export const customerOnly = requireRole("customer");
export const restaurantOnly = requireRole("restaurant");
