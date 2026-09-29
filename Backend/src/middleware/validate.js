export function validate(schema, property = "body") {
  return function validateRequest(req, res, next) {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      const validationError = new Error(
        error.details.map((detail) => detail.message).join(", "),
      );
      validationError.statusCode = 400;
      validationError.code = "VALIDATION_ERROR";
      return next(validationError);
    }

    req[property] = value;
    return next();
  };
}
