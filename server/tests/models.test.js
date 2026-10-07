import { describe, it } from "node:test";
import assert from "node:assert/strict";
import Order from "../src/models/order.model.js";
import Coupon from "../src/models/coupon.model.js";
import Complaint from "../src/models/complaint.model.js";
import Notification from "../src/models/notification.model.js";
import Address from "../src/models/address.model.js";

describe("Database Models & Schemas", () => {
  it("Order model contains all required schema paths and enums", () => {
    const paths = Object.keys(Order.schema.paths);
    assert.ok(paths.includes("restaurantId"));
    assert.ok(paths.includes("customerId"));
    assert.ok(paths.includes("orderStatus"));
    assert.ok(paths.includes("billDetails.finalAmount"));
    assert.ok(paths.includes("deliveryAddress.address"));
    assert.ok(paths.includes("paymentDetails.paymentStatus"));

    const statusEnum = Order.schema.path("orderStatus").enumValues;
    assert.ok(statusEnum.includes("placed"));
    assert.ok(statusEnum.includes("restaurant_accepted"));
    assert.ok(statusEnum.includes("preparing"));
    assert.ok(statusEnum.includes("ready_for_pickup"));
    assert.ok(statusEnum.includes("out_for_delivery"));
    assert.ok(statusEnum.includes("delivered"));
  });

  it("Coupon model schema paths are defined", () => {
    const paths = Object.keys(Coupon.schema.paths);
    assert.ok(paths.includes("code"));
    assert.ok(paths.includes("discountValue"));
    assert.ok(paths.includes("validUntil"));
    assert.ok(paths.includes("isActive"));
  });

  it("Complaint model schema paths are defined", () => {
    const paths = Object.keys(Complaint.schema.paths);
    assert.ok(paths.includes("ticketNumber"));
    assert.ok(paths.includes("userId"));
    assert.ok(paths.includes("subject"));
    assert.ok(paths.includes("status"));
  });

  it("Address model schema paths are defined", () => {
    const paths = Object.keys(Address.schema.paths);
    assert.ok(paths.includes("userId"));
    assert.ok(paths.includes("name"));
    assert.ok(paths.includes("phone"));
    assert.ok(paths.includes("address"));
  });

  it("Notification model schema paths are defined", () => {
    const paths = Object.keys(Notification.schema.paths);
    assert.ok(paths.includes("recipient"));
    assert.ok(paths.includes("title"));
    assert.ok(paths.includes("message"));
    assert.ok(paths.includes("isRead"));
  });
});
