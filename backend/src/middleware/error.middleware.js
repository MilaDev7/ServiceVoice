export function errorHandler(error, req, res, _next) {
  console.error({
    message: error.message,
    method: req.method,
    path: req.originalUrl
  });

  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      success: false,
      message: "Audio file is too large."
    });
  }

  return res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "An internal server error occurred."
        : error.message
  });
}