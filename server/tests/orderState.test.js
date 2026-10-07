import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  isValidOrderTransition,
  validateOrderTransition,
} from "../src/middleware/orderState.middleware.js";

describe("Order State Machine Validator", () => {
  it("allows legitimate order progression", () => {
    assert.equal(isValidOrderTransition("placed", "restaurant_accepted"), true);
    assert.equal(isValidOrderTransition("restaurant_accepted", "preparing"), true);
    assert.equal(isValidOrderTransition("preparing", "ready_for_pickup"), true);
    assert.equal(isValidOrderTransition("ready_for_pickup", "rider_assigned"), true);
    assert.equal(isValidOrderTransition("rider_assigned", "rider_arrived"), true);
    assert.equal(isValidOrderTransition("rider_arrived", "picked_up"), true);
    assert.equal(isValidOrderTransition("picked_up", "out_for_delivery"), true);
    assert.equal(isValidOrderTransition("out_for_delivery", "delivered"), true);
  });

  it("allows cancellation from initial states", () => {
    assert.equal(isValidOrderTransition("placed", "cancelled"), true);
    assert.equal(isValidOrderTransition("restaurant_accepted", "cancelled"), true);
  });

  it("blocks illegitimate transitions from terminal states", () => {
    assert.equal(isValidOrderTransition("delivered", "placed"), false);
    assert.equal(isValidOrderTransition("delivered", "cancelled"), false);
    assert.equal(isValidOrderTransition("cancelled", "preparing"), false);
  });

  it("blocks invalid skips like placed directly to delivered", () => {
    assert.equal(isValidOrderTransition("placed", "delivered"), false);
  });

  it("validateOrderTransition throws error on invalid transition", () => {
    assert.throws(() => {
      validateOrderTransition("delivered", "preparing");
    }, /Invalid order state transition/);
  });

  it("validateOrderTransition does not throw on valid transition", () => {
    assert.doesNotThrow(() => {
      validateOrderTransition("placed", "restaurant_accepted");
    });
  });
});
