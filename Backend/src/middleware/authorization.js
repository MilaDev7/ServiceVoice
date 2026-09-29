export function authorization(...allowedRoles) {
  return function authorizeRequest(req, res, next) {
    if (!allowedRoles.length) {
      return next();
    }

    const userRole = req.user?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      const error = new Error("You do not have permission to perform this action");
      error.statusCode = 403;
      error.code = "FORBIDDEN";
      return next(error);
    }

    return next();
  };
}
