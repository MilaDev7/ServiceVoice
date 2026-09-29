export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const statusCode = error.statusCode || 500;
  const response = {
    success: false,
    error: error.message || "Internal server error",
  };

  if (error.code) {
    response.code = error.code;
  }

  if (statusCode >= 500 && process.env.NODE_ENV !== "test") {
    console.error(error);
  }

  return res.status(statusCode).json(response);
}
