const VALID_TRANSITIONS = {
  placed: ["restaurant_accepted", "accepted", "preparing", "cancelled", "rejected"],
  pending: ["restaurant_accepted", "accepted", "preparing", "cancelled", "rejected"],
  restaurant_accepted: ["preparing", "ready_for_pickup", "ready", "cancelled", "rejected"],
  accepted: ["preparing", "ready_for_pickup", "ready", "cancelled", "rejected"],
  preparing: ["ready_for_pickup", "ready", "cancelled"],
  ready_for_pickup: ["rider_assigned", "rider_arrived", "picked_up", "pickedUp", "out_for_delivery", "outForDelivery", "cancelled"],
  ready: ["rider_assigned", "rider_arrived", "picked_up", "pickedUp", "out_for_delivery", "outForDelivery", "cancelled"],
  rider_assigned: ["rider_arrived", "picked_up", "pickedUp", "cancelled"],
  rider_arrived: ["picked_up", "pickedUp", "cancelled"],
  picked_up: ["out_for_delivery", "outForDelivery", "delivered", "undeliverable"],
  pickedUp: ["out_for_delivery", "outForDelivery", "delivered", "undeliverable"],
  out_for_delivery: ["delivered", "undeliverable"],
  outForDelivery: ["delivered", "undeliverable"],
  onTheWay: ["delivered", "undeliverable"],
  delivered: [],
  cancelled: [],
  rejected: [],
  undeliverable: [],
  failed: [],
};

export const isValidOrderTransition = (currentStatus, newStatus) => {
  if (!currentStatus || !newStatus) return false;
  if (currentStatus === newStatus) return true;
  const allowed = VALID_TRANSITIONS[currentStatus];
  if (!allowed) return false;
  return allowed.includes(newStatus);
};

export const validateOrderTransition = (currentStatus, newStatus) => {
  if (!isValidOrderTransition(currentStatus, newStatus)) {
    const error = new Error(
      `Invalid order state transition from '${currentStatus}' to '${newStatus}'.`
    );
    error.statusCode = 400;
    throw error;
  }
};
