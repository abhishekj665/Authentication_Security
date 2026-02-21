export const role = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized. User not authenticated",
        });
      }

      const userRole = req.user.role;

      if (!userRole) {
        return res.status(403).json({
          success: false,
          message: "Forbidden. Role not found",
        });
      }

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required role: ${allowedRoles.join(", ")}`,
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
