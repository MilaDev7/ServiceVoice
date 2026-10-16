export function errorHandler(error, req, res, _next) {
  console.error({
    message: error.message,
    method: req.method,
    path: req.originalUrl,
    statusCode: error.statusCode
  });

  // File upload errors
  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      success: false,
      message: "Audio file is too large."
    });
  }

  // Use the error's statusCode if the service set one
  const status = error.statusCode || 500;

  return res.status(status).json({
    success: false,
    message:
      status === 500 && process.env.NODE_ENV === "production"
        ? "An internal server error occurred."
        : error.message
  });
}