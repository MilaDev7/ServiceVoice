import test from "node:test";
import assert from "node:assert/strict";
import { createTestApp, request } from "./helpers.js";
import { createToken } from "../src/services/auth.service.js";

function authApp() { return createTestApp(); }

test("Authentication: registration and login", async () => {
  const app = authApp();
  const registration = await request(app, "POST", "/api/auth/register", { email: "citizen@example.com", password: "correct-horse" });
  assert.equal(registration.status, 201);
  assert.ok(registration.body.data.accessToken);
  const login = await request(app, "POST", "/api/auth/login", { email: "citizen@example.com", password: "correct-horse" });
  assert.equal(login.status, 200);
  assert.ok(login.body.data.refreshToken);
});

test("Authentication: invalid credentials are rejected", async () => {
  const response = await request(authApp(), "POST", "/api/auth/login", { email: "missing@example.com", password: "wrong-password" });
  assert.equal(response.status, 401);
});

test("Authentication: expired access token is rejected", async () => {
  const token = createToken({ sub: "user-1" }, -1);
  const response = await request(authApp(), "GET", "/api/me", undefined, { authorization: `Bearer ${token}` });
  assert.equal(response.status, 401);
  assert.match(response.body.error, /expired/i);
});

test("Authentication: refresh token issues a new access token", async () => {
  const app = authApp();
  const registration = await request(app, "POST", "/api/auth/register", { email: "refresh@example.com", password: "correct-horse" });
  const response = await request(app, "POST", "/api/auth/refresh", { refreshToken: registration.body.data.refreshToken });
  assert.equal(response.status, 200);
  assert.ok(response.body.data.accessToken);
});

test("Authentication: unauthorized request is rejected", async () => {
  const response = await request(authApp(), "GET", "/api/me");
  assert.equal(response.status, 401);
});
