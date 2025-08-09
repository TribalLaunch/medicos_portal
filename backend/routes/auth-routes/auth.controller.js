// src/routes/auth/auth.controller.js
import { registerFn } from "./functions/register.js";
import { loginFn } from "./functions/login.js";
import { meFn } from "./functions/me.js";

export async function register(req, res, next) {
  try {
    const { email, password, role, customer } = req.body;
    res.json(
      await registerFn({ email, password, role, customerPayload: customer })
    );
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
