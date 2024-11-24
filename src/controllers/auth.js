import createHttpError from 'http-errors';

import * as authServices from '../services/auth.js';
import { requestResetToken } from '../services/auth.js';
import { resetPassword } from '../services/auth.js';

const setupSession = (res, session) => {
  const { _id, refreshToken, refreshTokenValidUntil } = session;

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    expires: refreshTokenValidUntil,
  });

  res.cookie('sessionId', _id, {
    httpOnly: true,
    expires: refreshTokenValidUntil,
  });
};

export const registerController = async (req, res) => {
  const data = await authServices.register(req.body);
  const { password, ...userData } = data.toObject();

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: userData,
  });
};

export const loginController = async (req, res) => {
  const { _id, accessToken, refreshToken, refreshTokenValidUntil } =
    await authServices.login(req.body);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    expires: refreshTokenValidUntil,
  });

  res.cookie('sessionId', _id, {
    httpOnly: true,
    expires: refreshTokenValidUntil,
  });

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken,
    },
  });
};

export const refreshSessionController = async (req, res) => {
  const session = await authServices.refreshUserSession(req.cookies);

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutController = async (req, res) => {
  if (req.cookies.sessionId) {
    await authServices.logout(req.cookies.sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

export const requestResetEmailController = async (req, res, next) => {
  try {
    const { email } = req.body;
    await requestResetToken(email);

    res.status(200).json({
      message: 'Reset password email was successfully sent!',
      status: 200,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);
  res.json({
    message: 'Password has been successfully reset.',
    status: 200,
    data: {},
  });
};
