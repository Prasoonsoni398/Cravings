import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  requireRole,
  adminOnly,
  restaurantOnly,
  riderOnly,
} from "../src/middleware/roleGuard.middleware.js";

describe("Role Guard Middleware", () => {
  it("rejects request if req.user is missing", () => {
    const req = {};
    const res = {};
    let caughtError = null;
    const next = (err) => {
      caughtError = err;
    };

    const guard = requireRole("admin");
    guard(req, res, next);

    assert.ok(caughtError);
    assert.equal(caughtError.statusCode, 401);
  });

  it("blocks user with insufficient role", () => {
    const req = { user: { userType: "customer" } };
    const res = {};
    let caughtError = null;
    const next = (err) => {
      caughtError = err;
    };

    adminOnly(req, res, next);

    assert.ok(caughtError);
    assert.equal(caughtError.statusCode, 403);
    assert.match(caughtError.message, /Access denied/);
  });

  it("permits user with matching role", () => {
    const req = { user: { userType: "admin" } };
    const res = {};
    let nextCalled = false;
    let caughtError = null;
    const next = (err) => {
      nextCalled = true;
      caughtError = err;
    };

    adminOnly(req, res, next);

    assert.equal(nextCalled, true);
    assert.equal(caughtError, undefined);
  });

  it("riderOnly permits rider", () => {
    const req = { user: { userType: "rider" } };
    let nextCalled = false;
    riderOnly(req, {}, () => {
      nextCalled = true;
    });
    assert.equal(nextCalled, true);
  });

  it("restaurantOnly permits restaurant", () => {
    const req = { user: { userType: "restaurant" } };
    let nextCalled = false;
    restaurantOnly(req, {}, () => {
      nextCalled = true;
    });
    assert.equal(nextCalled, true);
  });
});
