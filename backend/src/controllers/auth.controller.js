import Joi from "joi";

import {
  registerUser,
  loginUser,
  refreshUserToken,
  createPasswordResetRequest,
  resetUserPassword
} from "../services/auth.service.js";

const registerSchema =
  Joi.object({
    name: Joi.string()
      .trim()
      .min(2)
      .max(100)
      .required(),

    email: Joi.string()
      .trim()
      .lowercase()
      .email()
      .max(255)
      .required(),

    password: Joi.string()
      .min(8)
      .max(128)
      .required()
  });

const loginSchema =
  Joi.object({
    email: Joi.string()
      .trim()
      .lowercase()
      .email()
      .required(),

    password: Joi.string()
      .required()
  });

const forgotPasswordSchema =
  Joi.object({
    email: Joi.string()
      .trim()
      .lowercase()
      .email()
      .required()
  });

const resetPasswordSchema =
  Joi.object({
    token: Joi.string()
      .trim()
      .min(20)
      .required(),

    password: Joi.string()
      .min(8)
      .max(128)
      .required()
  });

const refreshSchema =
  Joi.object({
    refreshToken: Joi.string()
      .required()
  });

export async function register(
  req,
  res,
  next
) {
  try {
    const {
      error,
      value
    } =
      registerSchema.validate(
        req.body
      );

    if (error) {
      return res.status(400).json({
        success: false,
        message:
          error.details[0].message
      });
    }

    const result =
      await registerUser(value);

    return res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
}

export async function login(
  req,
  res,
  next
) {
  try {
    const {
      error,
      value
    } =
      loginSchema.validate(
        req.body
      );

    if (error) {
      return res.status(400).json({
        success: false,
        message:
          error.details[0].message
      });
    }

    const result =
      await loginUser(value);

    return res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
}

export async function refresh(
  req,
  res,
  next
) {
  try {
    const {
      error,
      value
    } =
      refreshSchema.validate(
        req.body
      );

    if (error) {
      return res.status(400).json({
        success: false,
        message:
          error.details[0].message
      });
    }

    const result =
      await refreshUserToken(
        value.refreshToken
      );

    return res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
}

export async function forgotPassword(
  req,
  res,
  next
) {
  try {
    const {
      error,
      value
    } =
      forgotPasswordSchema.validate(
        req.body
      );

    if (error) {
      return res.status(400).json({
        success: false,
        message:
          error.details[0].message
      });
    }

    const resetToken =
      await createPasswordResetRequest(
        value.email
      );

    const response = {
      success: true,

      message:
        "If an account exists with this email, password reset instructions have been generated."
    };

    /*
     * DEVELOPMENT ONLY.
     *
     * Remove this before production
     * and send the token through email.
     */
    if (
      process.env.NODE_ENV !==
      "production"
    ) {
      response.data = {
        resetToken
      };
    }

    return res.json(response);
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(
  req,
  res,
  next
) {
  try {
    const {
      error,
      value
    } =
      resetPasswordSchema.validate(
        req.body
      );

    if (error) {
      return res.status(400).json({
        success: false,
        message:
          error.details[0].message
      });
    }

    await resetUserPassword(
      value
    );

    return res.json({
      success: true,
      message:
        "Password reset successfully."
    });
  } catch (error) {
    next(error);
  }
}

export async function me(
  req,
  res
) {
  return res.json({
    success: true,
    data: {
      user: req.user
    }
  });
}