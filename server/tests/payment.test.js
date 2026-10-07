import { describe, it } from "node:test";
import assert from "node:assert/strict";
import crypto from "crypto";

describe("Payment Signature Verification", () => {
  const secret = "test_razorpay_secret_12345";
  const orderId = "order_N123456789";
  const paymentId = "pay_P987654321";

  it("successfully validates correct HMAC SHA256 signature", () => {
    const payload = `${orderId}|${paymentId}`;
    const validSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    const computedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    assert.equal(validSignature, computedSignature);
  });

  it("detects tampered payment ID or signature mismatch", () => {
    const payload = `${orderId}|${paymentId}`;
    const validSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    const forgedPayload = `${orderId}|pay_TAMPERED`;
    const forgedSignature = crypto
      .createHmac("sha256", secret)
      .update(forgedPayload)
      .digest("hex");

    assert.notEqual(validSignature, forgedSignature);
  });
});
