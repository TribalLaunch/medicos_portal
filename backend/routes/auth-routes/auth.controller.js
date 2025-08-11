// src/routes/auth/auth.controller.js
import { registerFn } from "./functions/register.js";
import { loginFn } from "./functions/login.js";
import { meFn } from "./functions/me.js";
import { changePasswordFn } from "./functions/change_password.js";
import { forgotPasswordFn } from "./functions/forgot_password.js";
import { resetPasswordFn } from "./functions/reset_password.js";

export async function register(req, res, next) {
  try {
    const { email, password, role, customer_name, name } = req.body;
    res.json(await registerFn({ email, password, role, customer_name, name }));
  } catch (e) {
    next(e);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    res.json(await loginFn({ email, password }));
  } catch (e) {
    next(e);
  }
}

export async function me(req, res, next) {
  try {
    res.json(await meFn(req.user.id));
  } catch (e) {
    next(e);
  }
}

export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    res.json(
      await changePasswordFn({
        userId: req.user.id,
        currentPassword,
        newPassword,
      })
    );
  } catch (e) {
    next(e);
  }
}

export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    res.json(await forgotPasswordFn({ email }));
  } catch (e) {
    next(e);
  }
}

export async function resetPassword(req, res, next) {
  try {
    const { token, newPassword } = req.body;
    res.json(await resetPasswordFn({ rawToken: token, newPassword }));
  } catch (e) {
    next(e);
  }
}
