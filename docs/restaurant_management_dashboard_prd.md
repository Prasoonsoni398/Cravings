# Restaurant Management & Food Delivery Platform
## Detailed Product Requirements Document (PRD)

**Document Version:** 1.0  
**Status:** Product Definition  
**Platform Type:** Web application with four role-based dashboards  
**Primary Roles:** Admin, Restaurant Manager, User/Customer, Rider  
**Core Model:** Multi-restaurant food ordering and delivery management platform

---

# 1. Product Overview

The Restaurant Management & Food Delivery Platform is a role-based system that connects four primary stakeholders:

1. **Admin** – controls and monitors the entire platform.
2. **Restaurant Manager** – manages one restaurant, its menu, orders, staff/riders, delivery operations, and restaurant analytics.
3. **User/Customer** – discovers restaurants, browses menus, places orders, makes payments, tracks orders, and manages their account.
4. **Rider** – receives assigned deliveries, views pickup/drop-off information, updates delivery status, shares live location, and completes deliveries.

The platform must support the complete lifecycle:

**Restaurant discovery → Menu browsing → Cart → Checkout → Payment → Restaurant acceptance → Food preparation → Rider assignment → Pickup → Live delivery tracking → Delivery completion → Rating/feedback**

The system should be designed as a scalable multi-restaurant platform where an admin can manage multiple restaurants while each restaurant manager has access only to their own restaurant's operational data.

---

# 2. Product Goals

## 2.1 Primary Goals

- Provide a centralized platform for managing restaurants and food orders.
- Give restaurant managers complete operational control over their restaurants.
- Allow customers to order food through a simple and intuitive interface.
- Allow managers to assign and manage riders.
- Provide real-time rider location tracking to authorized users.
- Provide clear order status visibility at every stage.
- Give administrators platform-wide visibility and control.
- Reduce manual restaurant and delivery coordination.
- Provide analytics for business and operational decision-making.

## 2.2 Secondary Goals

- Improve restaurant order processing speed.
- Reduce delivery coordination errors.
- Improve customer transparency.
- Improve rider utilization.
- Provide actionable restaurant and platform analytics.
- Create an architecture that can later support multiple branches, promotions, subscriptions, loyalty programs, and advanced delivery optimization.

---

# 3. Non-Goals for Initial Version

The first version does not need to include:

- Advanced AI food recommendations.
- Automated route optimization using machine learning.
- Warehouse/inventory management for restaurant raw materials.
- Payroll management.
- Full accounting/ERP functionality.
- Multi-country tax rules.
- Advanced loyalty marketplace.
- Complex franchise management.

These can be considered future enhancements.

---

# 4. User Roles & Access Model

## 4.1 Admin

The Admin has platform-wide access.

### Admin can:

- Manage all users.
- Manage all restaurants.
- Approve/reject restaurants.
- Manage restaurant managers.
- View all riders.
- Suspend/activate riders.
- View all orders.
- Monitor live deliveries.
- View platform revenue.
- Manage categories.
- Manage platform settings.
- Manage coupons/promotions.
- Handle complaints.
- Manage reviews.
- View analytics.
- Configure commissions/fees.
- View system activity logs.

### Admin cannot:

- Change a customer's password directly.
- Modify financial records without audit logging.
- Access sensitive payment credentials.

---

# 5. Restaurant Manager

A Restaurant Manager is associated with a specific restaurant.

## Manager capabilities

- Manage restaurant profile.
- Manage restaurant operating hours.
- Manage menu categories.
- Add/edit/delete menu items.
- Manage item prices.
- Manage item availability.
- Manage item images.
- Manage modifiers/add-ons.
- Receive orders.
- Accept/reject orders.
- Update food preparation status.
- View active deliveries.
- Manage riders assigned to the restaurant.
- Assign riders to orders.
- Reassign riders.
- View rider live location.
- View rider delivery history.
- Manage restaurant offers.
- View restaurant analytics.
- Manage restaurant staff if enabled.
- Handle customer order issues.
- Respond to reviews where supported.

A manager must never be able to access another restaurant's private operational data.

---

# 6. User / Customer

Customers can:

- Register/login.
- Manage profile.
- Add addresses.
- Discover restaurants.
- Search restaurants.
- Filter restaurants.
- Browse menus.
- Search menu items.
- Add items to cart.
- Customize items.
- Apply coupons.
- Place orders.
- Make payments.
- View order history.
- Cancel eligible orders.
- Track current orders.
- View rider location after delivery tracking begins.
- Contact restaurant/rider through allowed communication channels.
- Rate restaurants.
- Rate orders/riders where enabled.
- Save favorite restaurants/items.
- Receive notifications.

---

# 7. Rider

Riders are managed by restaurant managers.

## Rider capabilities

- Login.
- View profile.
- Set online/offline availability.
- View assigned orders.
- Accept/reject assignment where business rules allow.
- View pickup location.
- View customer delivery location.
- Navigate to restaurant.
- Mark arrived at restaurant.
- Mark order picked up.
- Start delivery.
- Share live GPS location.
- Mark arrived at customer location.
- Complete delivery.
- Upload proof of delivery where required.
- View delivery history.
- View earnings if the system supports rider earnings.
- Receive notifications.

## Rider restrictions

A rider cannot:

- Modify restaurant menus.
- Modify customer orders.
- Access another restaurant's management dashboard.
- Assign orders to themselves unless explicitly allowed.
- Modify payment information.
- View unrelated customer data.

---

# 8. Role Permission Matrix

| Feature | Admin | Manager | User | Rider |
|---|---|---|---|---|
| Platform Dashboard | Yes | No | No | No |
| Restaurant Management | All | Own | View | No |
| Menu Management | All | Own | View | No |
| Order Management | All | Own | Own | Assigned |
| Rider Management | All | Own Restaurant | No | Self |
| Rider Assignment | Override | Yes | No | No |
| Live Rider Tracking | All | Own Restaurant | Own Order | Self |
| User Management | Yes | Limited | Self | Self |
| Coupons | Yes | Restaurant coupons | Use | No |
| Reviews | Moderate | Own restaurant | Create | Delivery review |
| Analytics | Platform | Restaurant | Personal | Personal |
| Settings | Platform | Restaurant | Account | Account |
| Audit Logs | Yes | Limited | No | No |

---

# 9. Application Architecture

The system should be divided into:

```text
                    ┌────────────────────┐
                    │     ADMIN APP      │
                    └─────────┬──────────┘
                              │
┌──────────────┐     ┌────────▼────────┐     ┌──────────────┐
│ USER APP     │────►│ BACKEND / API   │◄────│ MANAGER APP  │
└──────────────┘     └────────┬────────┘     └──────────────┘
                              │
                       ┌──────▼──────┐
                       │ Rider App   │
                       └─────────────┘
                              │
                  ┌───────────▼───────────┐
                  │ Database + Realtime   │
                  │ Notification Service │
                  │ Payment Service      │
                  │ Maps/Location        │
                  └───────────────────────┘
```

---

# 10. Dashboard 1 — Admin Dashboard

## 10.1 Admin Dashboard Home

The dashboard should immediately communicate platform health.

### KPI Cards

- Total Restaurants
- Active Restaurants
- Pending Restaurant Approvals
- Total Users
- Active Riders
- Orders Today
- Completed Orders
- Cancelled Orders
- Revenue Today
- Revenue This Month

### Charts

- Orders over time
- Revenue over time
- Orders by restaurant
- Orders by status
- New users
- New restaurants
- Rider activity
- Cancellation rate

### Live Operations

Show:

- Active orders
- Orders waiting for restaurant acceptance
- Orders waiting for rider
- Active deliveries
- Delayed deliveries
- Failed deliveries

---

# 11. Admin — Restaurant Management

## Restaurant List

Columns:

- Restaurant ID
- Restaurant Name
- Manager
- Location
- Status
- Rating
- Total Orders
- Revenue
- Created Date
- Actions

### Filters

- Status
- City
- Rating
- Revenue
- Date created
- Order volume

### Restaurant actions

- View
- Edit
- Approve
- Reject
- Suspend
- Activate
- View analytics
- View orders

---

# 12. Admin — Restaurant Approval

New restaurants should enter:

**Pending → Under Review → Approved / Rejected**

### Approval details

Admin can review:

- Restaurant name
- Owner/manager information
- Contact information
- Address
- Documents
- Cuisine
- Operating hours
- Bank/payment information where applicable
- Menu readiness
- Delivery availability

---

# 13. Admin — User Management

User table:

- User ID
- Name
- Email
- Phone
- Account status
- Total orders
- Total spending
- Registration date
- Last active

Actions:

- View
- Suspend
- Activate
- View order history
- View complaints

---

# 14. Admin — Rider Management

Admin can see:

- Rider name
- Assigned restaurant
- Phone
- Status
- Online/offline
- Current location
- Current order
- Completed deliveries
- Cancellation count
- Rating

Statuses:

```text
Offline
Online
Available
Assigned
Picking Up
Delivering
Suspended
```

---

# 15. Admin — Order Management

Order table:

- Order ID
- Customer
- Restaurant
- Rider
- Amount
- Payment status
- Order status
- Created time
- Delivery time
- Actions

### Order statuses

```text
PLACED
RESTAURANT_ACCEPTED
PREPARING
READY_FOR_PICKUP
RIDER_ASSIGNED
RIDER_ARRIVED
PICKED_UP
OUT_FOR_DELIVERY
DELIVERED
CANCELLED
FAILED
```

Admin can inspect the complete order timeline.

---

# 16. Admin — Live Delivery Map

The Admin should have a map showing:

- Active restaurants
- Riders
- Active orders
- Rider current location
- Pickup location
- Delivery location
- Route
- Delivery status

Selecting a rider should open:

- Rider name
- Current order
- Current location
- Last location update
- Speed where available
- ETA
- Restaurant
- Customer delivery area
- Order status

---

# 17. Admin — Categories & Platform Configuration

Admin can manage:

- Cuisine categories
- Food categories
- Delivery charges
- Platform commission
- Tax configuration
- Service fee
- Minimum order amount
- Maximum delivery radius
- Cancellation policies
- Payment methods
- Order timeout rules

---

# 18. Admin — Coupon & Promotion Management

Admin can create:

- Percentage discounts
- Fixed amount discounts
- Restaurant-specific coupons
- New-user coupons
- Minimum-order coupons
- Date-limited coupons
- Usage-limited coupons

Fields:

- Coupon code
- Discount type
- Discount value
- Minimum order
- Maximum discount
- Start date
- End date
- Usage limit
- Per-user limit
- Restaurant scope
- Active/inactive

---

# 19. Admin — Complaints & Support

Support dashboard:

- Complaint ID
- User
- Restaurant
- Order
- Category
- Priority
- Status
- Assigned support agent
- Created time

Statuses:

```text
OPEN
IN_REVIEW
WAITING_FOR_RESTAURANT
WAITING_FOR_USER
RESOLVED
CLOSED
```

---

# 20. Dashboard 2 — Restaurant Manager

## 20.1 Manager Dashboard Home

The manager's dashboard focuses on restaurant operations.

### KPI cards

- Today's Orders
- Pending Orders
- Preparing
- Ready for Pickup
- Active Deliveries
- Completed Today
- Revenue Today
- Average Order Value

### Operational panel

Show urgent actions:

- New orders waiting for acceptance.
- Orders taking too long.
- Orders waiting for riders.
- Riders currently unavailable.
- Low availability menu items.

---

# 21. Manager — Restaurant Profile

Manager can manage:

- Restaurant name
- Logo
- Cover image
- Description
- Cuisine
- Phone
- Email
- Address
- Coordinates
- Opening hours
- Closing hours
- Holiday schedule
- Delivery radius
- Minimum order
- Estimated preparation time

---

# 22. Manager — Menu Management

Menu structure:

```text
Restaurant
 ├── Category
 │    ├── Item
 │    │    ├── Price
 │    │    ├── Image
 │    │    ├── Description
 │    │    ├── Add-ons
 │    │    └── Availability
 │    └── Item
 └── Category
```

## Menu item fields

- Item name
- Description
- Price
- Discounted price
- Category
- Image
- Vegetarian/non-vegetarian
- Preparation time
- Availability
- Featured
- Tax
- Add-ons
- Variants

### Menu actions

- Add
- Edit
- Delete
- Duplicate
- Hide
- Mark unavailable
- Reorder
- Bulk update

---

# 23. Manager — Add-ons & Variants

Example:

```text
Pizza
 ├── Size
 │   ├── Small
 │   ├── Medium
 │   └── Large
 └── Add-ons
     ├── Extra Cheese
     ├── Olives
     └── Jalapeno
```

Manager can configure:

- Required/optional modifiers
- Minimum selections
- Maximum selections
- Additional price
- Default selection

---

# 24. Manager — Order Management

The manager should have a Kanban-style order board.

```text
NEW
 ↓
ACCEPTED
 ↓
PREPARING
 ↓
READY
 ↓
RIDER ASSIGNED
 ↓
PICKED UP
 ↓
DELIVERING
 ↓
DELIVERED
```

Each order card should display:

- Order ID
- Customer name
- Items
- Quantity
- Amount
- Payment status
- Order time
- Preparation time
- Rider
- Delivery status

---

# 25. Manager — Order Details

Order details include:

### Customer

- Name
- Contact option
- Delivery address

### Items

- Item
- Quantity
- Price
- Add-ons
- Special instructions

### Payment

- Subtotal
- Discount
- Tax
- Delivery fee
- Final total
- Payment method
- Payment status

### Delivery

- Rider
- Pickup status
- Current rider location
- Delivery status
- ETA

### Timeline

```text
13:01 Order placed
13:02 Restaurant accepted
13:07 Preparation started
13:20 Food ready
13:21 Rider assigned
13:27 Rider arrived
13:30 Order picked up
13:48 Delivered
```

---

# 26. Manager — Rider Management

The restaurant manager owns rider operations for their restaurant.

## Rider list

Columns:

- Rider
- Phone
- Status
- Current order
- Location
- Completed deliveries
- Rating
- Joined date

### Rider actions

- Add rider
- Edit rider
- Activate/deactivate
- Suspend
- Assign order
- View location
- View history

---

# 27. Manager — Add Rider

Fields:

- Name
- Phone
- Email
- Profile photo
- Address
- Government/identity details if legally required
- Emergency contact
- Vehicle type
- Vehicle number
- License information if required
- Status

The manager should be able to invite the rider rather than manually creating a password.

---

# 28. Manager — Rider Assignment

Orders waiting for delivery should show:

```text
Order #1024
Ready for Pickup

Available Riders:
Ravi       1.2 km
Aman       2.4 km
Rahul      3.1 km
```

Manager can:

- Assign rider.
- Reassign rider.
- Cancel assignment.
- View rider location before assignment.
- Prioritize nearby riders.

---

# 29. Manager — Realtime Rider Tracking

The manager should have a live map.

For each rider:

- Current GPS coordinates
- Online/offline
- Current order
- Current status
- Last update time
- ETA
- Route

### Location update model

The rider device periodically sends:

```json
{
  "riderId": "RID123",
  "latitude": 23.2599,
  "longitude": 77.4126,
  "accuracy": 10,
  "heading": 180,
  "speed": 32,
  "timestamp": "2026-10-06T10:30:00Z"
}
```

The backend broadcasts authorized location updates through a realtime channel.

---

# 30. Dashboard 3 — User / Customer

## 30.1 Customer Home

Sections:

- Search
- Location/address selector
- Categories
- Recommended restaurants
- Popular restaurants
- Offers
- Recently ordered
- Favorite restaurants

---

# 31. Customer — Restaurant Discovery

Restaurant card:

- Cover image
- Logo
- Restaurant name
- Rating
- Cuisine
- Delivery estimate
- Delivery fee
- Minimum order
- Open/closed status
- Offer badge

Filters:

- Rating
- Cuisine
- Price
- Delivery time
- Vegetarian
- Offers
- Open now

---

# 32. Customer — Restaurant Page

Display:

- Restaurant header
- Rating
- Cuisine
- Delivery information
- Operating hours
- Search menu
- Categories
- Menu items

Menu item card:

- Image
- Name
- Description
- Price
- Rating if available
- Vegetarian/non-vegetarian indicator
- Add button

---

# 33. Customer — Cart

Cart should show:

- Restaurant
- Items
- Quantity controls
- Add-ons
- Item prices
- Special instructions
- Coupon field
- Subtotal
- Discount
- Tax
- Delivery fee
- Final amount

### Business rule

A cart should normally contain items from one restaurant only.

If the customer attempts to add an item from another restaurant:

```text
Your cart contains items from Restaurant A.
Clear the current cart and add items from Restaurant B?
```

---

# 34. Customer — Checkout

Checkout sections:

### Address

- Saved addresses
- Add address
- Edit address
- Select address

### Delivery

- Estimated delivery time
- Delivery instructions

### Payment

- Card
- UPI
- Wallet
- Cash on delivery if enabled
- Other configured gateways

### Final review

Customer must see the complete amount before placing the order.

---

# 35. Customer — Order Tracking

After ordering, display a tracking screen.

```text
Order Placed
    ↓
Restaurant Accepted
    ↓
Preparing
    ↓
Ready
    ↓
Rider Assigned
    ↓
Picked Up
    ↓
On the Way
    ↓
Delivered
```

When the rider is actively delivering:

- Live map
- Rider marker
- Restaurant marker
- Customer marker
- Route
- ETA
- Rider status
- Last updated time

---

# 36. Customer — Live Rider Location

Live location should only become visible when the order reaches the appropriate delivery stage.

Recommended rule:

```text
RIDER_ASSIGNED
    ↓
RIDER_ARRIVED
    ↓
PICKED_UP
    ↓
OUT_FOR_DELIVERY
        → Live location enabled
```

Location access should stop after delivery is completed.

---

# 37. Customer — Order History

Each order shows:

- Order ID
- Restaurant
- Date
- Items
- Total
- Status
- Payment status

Actions:

- View details
- Reorder
- Download invoice
- Rate order
- Report issue

---

# 38. Customer — Reviews & Ratings

Customer can rate:

- Restaurant
- Food
- Delivery experience
- Rider where enabled

Rating:

```text
★★★★★
```

Optional:

- Comment
- Food quality tags
- Packaging tags
- Delivery tags

---

# 39. Dashboard 4 — Rider

## 39.1 Rider Dashboard Home

Display:

- Online/offline toggle
- Current assignment
- Today's deliveries
- Completed deliveries
- Earnings where supported
- Rating
- Current status

Primary CTA:

```text
GO ONLINE
```

---

# 40. Rider — Availability

Rider statuses:

```text
OFFLINE
ONLINE
AVAILABLE
ASSIGNED
AT_RESTAURANT
PICKED_UP
OUT_FOR_DELIVERY
AT_CUSTOMER
COMPLETED
```

When offline:

- No new assignments should be sent.

When online and available:

- Rider can receive new delivery assignments.

---

# 41. Rider — Delivery Request

A delivery request should display:

- Order ID
- Restaurant
- Pickup distance
- Customer delivery area
- Estimated distance
- Estimated time
- Number of items
- Delivery priority if applicable

Actions:

```text
ACCEPT
DECLINE
```

If assignment is automatic and cannot be declined, show the appropriate business rule.

---

# 42. Rider — Pickup Flow

### Step 1

Navigate to restaurant.

### Step 2

Mark:

```text
ARRIVED AT RESTAURANT
```

### Step 3

Restaurant hands over order.

### Step 4

Rider confirms:

```text
ORDER PICKED UP
```

### Step 5

System starts delivery tracking.

---

# 43. Rider — Delivery Flow

Rider sees:

- Customer location
- Route
- ETA
- Customer instructions
- Order summary

Actions:

```text
START DELIVERY
ARRIVED AT CUSTOMER
COMPLETE DELIVERY
```

Proof of delivery can optionally include:

- OTP
- Signature
- Photo
- Delivery confirmation

---

# 44. Realtime Location Architecture

A realtime communication layer is required.

Recommended conceptual flow:

```text
Rider Device
     │
     │ GPS updates
     ▼
Location Service
     │
     ├──────────────► Manager Dashboard
     │
     ├──────────────► Admin Dashboard
     │
     └──────────────► Customer Tracking
```

Possible technologies:

- WebSocket
- Socket.IO
- Server-Sent Events where appropriate
- Firebase Realtime Database
- Supabase Realtime
- Managed realtime infrastructure

The implementation should use one consistent realtime mechanism rather than multiple competing systems.

---

# 45. Location Privacy & Security

Location tracking must be permission-based.

### Rules

- Rider location is collected only while the rider is online/working according to policy.
- Customer sees the rider only for their active order.
- Manager sees riders belonging to their restaurant.
- Admin may see platform-wide active riders according to administrative permissions.
- Location access ends when the delivery ends.
- Historical location retention should be minimized.
- Sensitive location data must not be publicly accessible.

---

# 46. Notifications

The system should support:

- In-app notifications
- Push notifications
- Email where needed
- SMS/WhatsApp only if separately integrated

## Customer notifications

- Order placed
- Order accepted
- Order rejected
- Food preparing
- Food ready
- Rider assigned
- Rider arrived
- Out for delivery
- Delivered
- Cancelled
- Payment failed

## Manager notifications

- New order
- Order cancellation
- Rider unavailable
- Delivery delayed
- Payment issue

## Rider notifications

- New delivery assignment
- Assignment cancelled
- Order ready
- Customer update
- Delivery issue

## Admin notifications

- New restaurant registration
- Restaurant approval request
- Critical delivery issue
- Platform-level alert

---

# 47. Order State Machine

The backend should enforce valid transitions.

```text
PLACED
  │
  ├──► CANCELLED
  │
  ▼
RESTAURANT_ACCEPTED
  │
  ▼
PREPARING
  │
  ▼
READY_FOR_PICKUP
  │
  ▼
RIDER_ASSIGNED
  │
  ▼
RIDER_ARRIVED
  │
  ▼
PICKED_UP
  │
  ▼
OUT_FOR_DELIVERY
  │
  ▼
DELIVERED
```

Invalid transitions must be rejected by the backend.

For example:

```text
DELIVERED → PREPARING
```

must not be allowed.

---

# 48. Database Design

A relational database or well-structured document database can be used.

Recommended major entities:

```text
User
Role
Restaurant
RestaurantManager
RestaurantCategory
MenuCategory
MenuItem
MenuModifier
Cart
CartItem
Address
Order
OrderItem
Payment
Rider
RiderAssignment
RiderLocation
Coupon
Review
Notification
Complaint
AuditLog
```

---

# 49. User Entity

```text
User
- id
- name
- email
- phone
- passwordHash
- role
- avatar
- status
- createdAt
- updatedAt
```

Roles:

```text
ADMIN
MANAGER
USER
RIDER
```

---

# 50. Restaurant Entity

```text
Restaurant
- id
- name
- description
- logo
- coverImage
- managerId
- phone
- email
- address
- latitude
- longitude
- cuisine
- status
- openingTime
- closingTime
- deliveryRadius
- minimumOrder
- rating
- createdAt
- updatedAt
```

---

# 51. Menu Item Entity

```text
MenuItem
- id
- restaurantId
- categoryId
- name
- description
- price
- discountPrice
- image
- preparationTime
- isAvailable
- isFeatured
- foodType
- tax
- createdAt
- updatedAt
```

---

# 52. Order Entity

```text
Order
- id
- userId
- restaurantId
- riderId
- addressId
- subtotal
- discount
- tax
- deliveryFee
- total
- paymentStatus
- orderStatus
- estimatedDeliveryTime
- placedAt
- acceptedAt
- preparedAt
- pickedUpAt
- deliveredAt
- cancelledAt
```

---

# 53. Rider Location Entity

```text
RiderLocation
- id
- riderId
- orderId
- latitude
- longitude
- accuracy
- heading
- speed
- timestamp
```

For high-frequency location updates, the production architecture should avoid unnecessarily writing every GPS event directly into the primary transactional database. A realtime/location store or streaming layer can be used, with selected history persisted according to retention requirements.

---

# 54. API Structure

Example REST API structure:

```text
/api/auth
/api/users
/api/restaurants
/api/menu
/api/categories
/api/orders
/api/payments
/api/riders
/api/deliveries
/api/locations
/api/coupons
/api/reviews
/api/notifications
/api/complaints
/api/admin
```

---

# 55. Authentication APIs

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
POST /api/auth/forgot-password
POST /api/auth/reset-password
GET  /api/auth/me
```

Use secure session/token management and role-based authorization.

---

# 56. Restaurant APIs

```http
GET    /api/restaurants
GET    /api/restaurants/:id
POST   /api/restaurants
PATCH  /api/restaurants/:id
DELETE /api/restaurants/:id
PATCH  /api/restaurants/:id/status
```

---

# 57. Menu APIs

```http
GET    /api/restaurants/:restaurantId/menu
POST   /api/menu/items
GET    /api/menu/items/:id
PATCH  /api/menu/items/:id
DELETE /api/menu/items/:id
PATCH  /api/menu/items/:id/availability
```

---

# 58. Order APIs

```http
POST  /api/orders
GET   /api/orders/:id
GET   /api/orders/my-orders
GET   /api/restaurants/:restaurantId/orders
PATCH /api/orders/:id/status
POST  /api/orders/:id/cancel
```

---

# 59. Rider APIs

```http
GET   /api/riders
POST  /api/riders
GET   /api/riders/:id
PATCH /api/riders/:id
PATCH /api/riders/:id/status
GET   /api/riders/:id/orders
```

---

# 60. Delivery APIs

```http
POST  /api/deliveries/:orderId/assign
POST  /api/deliveries/:orderId/reassign
PATCH /api/deliveries/:orderId/pickup
PATCH /api/deliveries/:orderId/start
PATCH /api/deliveries/:orderId/complete
```

---

# 61. Realtime Events

Example event names:

```text
order.created
order.accepted
order.rejected
order.status.changed

rider.assigned
rider.location.updated
rider.arrived
rider.picked_up
rider.delivery.started
rider.delivery.completed

notification.created
```

---

# 62. Authorization Rules

Every backend request must validate:

1. Authentication.
2. User role.
3. Resource ownership.
4. Restaurant ownership where applicable.
5. Order ownership where applicable.

Example:

```text
Manager A
   ↓
Restaurant A
   ↓
Orders A
```

Manager A must not request:

```text
Restaurant B
Orders B
Riders B
```

even if they know the IDs.

---

# 63. Dashboard UI/UX Requirements

The dashboard should feel modern, clean, professional, and operational.

## Design principles

- Minimal color palette.
- Strong typography hierarchy.
- Clear spacing.
- High information density without feeling crowded.
- Responsive layout.
- Consistent cards.
- Consistent status badges.
- Clear primary actions.
- Confirmation for destructive actions.
- Skeleton loading states.
- Empty states.
- Error states.
- Toast notifications.

---

# 64. Recommended Dashboard Layout

```text
┌────────────────────────────────────────────────────────────┐
│ Logo        Search                 Notification   Profile  │
├────────────┬───────────────────────────────────────────────┤
│ Sidebar    │                                               │
│            │ Page Header                                    │
│ Dashboard  │                                               │
│ Orders     │ KPI Cards                                      │
│ Restaurant │                                               │
│ Menu       │ Charts / Tables / Operations                  │
│ Riders     │                                               │
│ Analytics  │                                               │
│ Settings   │                                               │
└────────────┴───────────────────────────────────────────────┘
```

---

# 65. Responsive Requirements

## Desktop

- Full sidebar.
- Multi-column dashboard.
- Large map.
- Data tables.

## Tablet

- Collapsible sidebar.
- Reduced table columns.
- Responsive cards.

## Mobile

- Bottom navigation where appropriate.
- Drawer navigation.
- Stacked cards.
- Mobile-friendly order management.
- Full-screen maps.
- Large action buttons for riders.

The Rider interface should prioritize mobile usability because riders will primarily use the system while moving.

---

# 66. Design System

Suggested visual direction:

- Neutral/light background.
- White cards.
- Dark text.
- One primary brand color.
- Green for success.
- Red for errors/cancellation.
- Orange/yellow for warnings.
- Blue for informational states.

Avoid using too many colors simultaneously.

---

# 67. Order Status Colors

```text
Pending       → Warning
Accepted      → Information
Preparing     → Information
Ready         → Success
Assigned      → Purple/Information
Out Delivery  → Primary
Delivered     → Success
Cancelled     → Error
Failed        → Error
```

---

# 68. Important UI Components

Reusable components should include:

- Sidebar
- Header
- Breadcrumb
- Search
- DataTable
- Pagination
- Modal
- Drawer
- Dropdown
- Tabs
- StatusBadge
- KPI Card
- Chart Card
- OrderCard
- OrderTimeline
- RestaurantCard
- MenuItemCard
- RiderCard
- MapPanel
- LocationMarker
- NotificationPanel
- ConfirmationDialog
- EmptyState
- ErrorState
- LoadingSkeleton
- Toast

---

# 69. Analytics

## Admin Analytics

- Total GMV/revenue
- Orders
- Average order value
- Restaurant performance
- User growth
- Rider performance
- Cancellation rate
- Delivery time
- Platform commission
- Popular restaurants
- Popular food categories

## Manager Analytics

- Restaurant revenue
- Daily/weekly/monthly orders
- Average order value
- Popular items
- Least-performing items
- Cancellation rate
- Preparation time
- Delivery time
- Rider performance

## User Analytics

- Total orders
- Total spending
- Favorite restaurants
- Favorite items
- Average order value

## Rider Analytics

- Completed deliveries
- Average delivery time
- Acceptance rate
- Cancellation rate
- Rating
- Earnings if enabled

---

# 70. Search & Filtering

Global search should support role-specific results.

Admin:

```text
Users
Restaurants
Orders
Riders
```

Manager:

```text
Orders
Menu items
Riders
Customers
```

User:

```text
Restaurants
Menu items
```

Rider:

```text
Assigned orders
```

---

# 71. Audit Logging

Important actions should be logged.

Examples:

```text
Admin approved restaurant
Manager changed menu price
Manager assigned rider
Manager cancelled order
Rider marked order picked up
User cancelled order
Admin suspended rider
```

Audit record:

```text
id
actorId
actorRole
action
resourceType
resourceId
metadata
timestamp
ipAddress
```

---

# 72. Error Handling

Every dashboard should handle:

### Loading

Show skeletons rather than blank pages.

### Empty

Example:

> No active deliveries right now.

### Error

Example:

> We couldn't load your orders. Please try again.

### Permission

Example:

> You don't have permission to access this resource.

### Network

Allow retry.

---

# 73. Security Requirements

- HTTPS everywhere.
- Password hashing.
- Secure authentication.
- Role-based access control.
- Resource-level authorization.
- Input validation.
- Rate limiting.
- Secure cookies/tokens.
- CSRF protection where applicable.
- XSS protection.
- SQL/NoSQL injection protection.
- File upload validation.
- Audit logs.
- Sensitive-data encryption where appropriate.
- Do not expose payment credentials.
- Do not expose rider/customer private information unnecessarily.

---

# 74. Payment Requirements

Payment flow:

```text
Cart
 ↓
Checkout
 ↓
Payment Initiated
 ↓
Payment Gateway
 ↓
Payment Verification
 ↓
Order Confirmed
```

The backend must verify payment status independently instead of trusting the frontend.

Statuses:

```text
PENDING
SUCCESS
FAILED
REFUNDED
PARTIALLY_REFUNDED
```

---

# 75. Cancellation Rules

Cancellation depends on order state.

Example:

```text
PLACED
   → Customer may cancel

ACCEPTED
   → Cancellation may require policy validation

PREPARING
   → Cancellation may be restricted

PICKED_UP
   → Customer cancellation normally unavailable

OUT_FOR_DELIVERY
   → Cancellation normally unavailable

DELIVERED
   → Cannot cancel
```

Exact policy should be configurable by Admin.

---

# 76. Delivery Assignment Logic

Initial version can support manual assignment:

```text
Restaurant Manager
       ↓
Ready Order
       ↓
View Available Riders
       ↓
Select Rider
       ↓
Assign
```

Future version can support automatic assignment:

```text
Ready Order
    ↓
Find Available Riders
    ↓
Calculate Distance
    ↓
Check Current Load
    ↓
Select Best Rider
    ↓
Send Assignment
```

---

# 77. Real-Time Order Synchronization

When the restaurant changes an order status:

```text
Manager
   ↓
Backend
   ↓
Realtime Event
   ├── Customer
   ├── Rider
   └── Admin
```

This avoids requiring customers to repeatedly refresh the order page.

---

# 78. Performance Requirements

Target goals:

- Dashboard initial load: preferably under 2–3 seconds under normal conditions.
- API response: preferably under 500ms for common operations.
- Realtime location updates should feel near-live.
- Images should be optimized.
- Use pagination for large datasets.
- Lazy-load charts and maps.
- Cache frequently accessed restaurant/menu data.
- Use indexes for high-volume database queries.

These are engineering targets, not absolute guarantees.

---

# 79. Realtime Location Update Strategy

Do not update GPS at maximum frequency continuously.

Recommended behavior:

- Update more frequently during active delivery.
- Reduce frequency when stationary.
- Stop delivery tracking after completion.
- Ignore obviously invalid coordinates.
- Reject impossible jumps.
- Store the latest location separately from historical data.

Example conceptual strategy:

```text
Rider moving:
    frequent updates

Rider stationary:
    less frequent updates

Order delivered:
    tracking stopped
```

---

# 80. Maps Requirements

The map layer should support:

- Current location.
- Restaurant marker.
- Customer marker.
- Rider marker.
- Route line.
- ETA.
- Distance.
- Map zoom.
- Marker status.

Potential providers:

- Google Maps
- Mapbox
- OpenStreetMap-based services

The final provider should be selected based on cost, India coverage, routing quality, SDK support, and licensing.

---

# 81. Restaurant Onboarding Flow

```text
Restaurant Manager Registration
          ↓
Restaurant Information
          ↓
Documents
          ↓
Menu Setup
          ↓
Submit for Approval
          ↓
Admin Review
          ↓
Approved
          ↓
Restaurant Goes Live
```

---

# 82. Rider Onboarding Flow

```text
Manager Adds/Invites Rider
          ↓
Rider Receives Invitation
          ↓
Rider Creates Account
          ↓
Profile Verification
          ↓
Manager Activates Rider
          ↓
Rider Goes Online
          ↓
Can Receive Deliveries
```

---

# 83. Customer Order Flow

```text
Open Platform
    ↓
Select Location
    ↓
Browse Restaurants
    ↓
Open Restaurant
    ↓
Browse Menu
    ↓
Add Items
    ↓
Cart
    ↓
Checkout
    ↓
Payment
    ↓
Order Placed
    ↓
Restaurant Accepts
    ↓
Food Prepared
    ↓
Rider Assigned
    ↓
Food Picked Up
    ↓
Live Tracking
    ↓
Delivered
    ↓
Review
```

---

# 84. Rider Delivery Flow

```text
Go Online
    ↓
Receive Assignment
    ↓
Accept
    ↓
Navigate to Restaurant
    ↓
Arrive
    ↓
Pick Up
    ↓
Start Delivery
    ↓
Share Live Location
    ↓
Navigate to Customer
    ↓
Arrive
    ↓
Verify Delivery
    ↓
Complete
    ↓
Available for Next Order
```

---

# 85. Manager Operational Flow

```text
Login
 ↓
Dashboard
 ↓
Receive Order
 ↓
Accept
 ↓
Prepare
 ↓
Mark Ready
 ↓
Assign Rider
 ↓
Track Rider
 ↓
Confirm Delivery
 ↓
Review Analytics
```

---

# 86. Admin Operational Flow

```text
Login
 ↓
Platform Dashboard
 ↓
Monitor Restaurants
 ↓
Monitor Users
 ↓
Monitor Riders
 ↓
Monitor Orders
 ↓
Monitor Live Deliveries
 ↓
Resolve Issues
 ↓
Review Analytics
 ↓
Manage Platform Settings
```

---

# 87. MVP Scope

## Must Have

### Admin

- Login
- Dashboard
- Restaurant management
- User management
- Rider management
- Order monitoring
- Restaurant approval
- Basic analytics

### Manager

- Login
- Restaurant profile
- Menu management
- Order management
- Rider management
- Manual rider assignment
- Live rider tracking
- Basic analytics

### User

- Registration/login
- Restaurant listing
- Restaurant details
- Menu
- Cart
- Checkout
- Payment
- Order tracking
- Order history

### Rider

- Login
- Online/offline
- Assigned orders
- Pickup workflow
- Delivery workflow
- GPS location sharing
- Delivery history

---

# 88. Phase 2

- Automatic rider assignment
- Coupons
- Advanced analytics
- Reviews
- Customer support
- Push notifications
- Multiple branches
- Scheduled orders
- Favorite restaurants
- Reordering
- Restaurant promotions

---

# 89. Phase 3

- AI recommendations
- Smart delivery optimization
- Demand forecasting
- Dynamic delivery pricing
- Loyalty program
- Subscription
- Advanced restaurant analytics
- Fleet optimization
- Automated customer support
- Advanced fraud detection

---

# 90. Acceptance Criteria

## Admin

- Admin can log in securely.
- Admin can view all restaurants.
- Admin can approve/reject restaurants.
- Admin can view all orders.
- Admin can monitor active deliveries.
- Admin can view platform analytics.

## Manager

- Manager can only access their restaurant.
- Manager can manage menu.
- Manager can accept/reject orders.
- Manager can mark orders ready.
- Manager can manage riders.
- Manager can assign riders.
- Manager can see assigned riders' live locations.

## User

- User can browse restaurants.
- User can add food to cart.
- User can place an order.
- User can make payment.
- User can track order status.
- User can see rider location during active delivery.
- User can view order history.

## Rider

- Rider can go online/offline.
- Rider can receive assigned orders.
- Rider can view pickup/drop locations.
- Rider can update delivery status.
- Rider can share live location.
- Rider can complete delivery.

---

# 91. Important Edge Cases

The system must handle:

- Restaurant closes after order placement.
- Restaurant rejects an order.
- Customer cancels order.
- Rider goes offline after assignment.
- Rider rejects assignment.
- Rider loses GPS.
- Customer changes address before preparation.
- Payment succeeds but order creation fails.
- Payment fails but frontend reports success.
- Restaurant has no available riders.
- Rider accepts multiple conflicting assignments.
- Order remains stuck in one status.
- Customer loses internet while tracking.
- GPS sends invalid coordinates.
- Delivery takes longer than ETA.
- Restaurant becomes temporarily unavailable.
- Menu item becomes unavailable after being added to cart.
- Coupon expires during checkout.
- Multiple users attempt to purchase limited-availability items.

---

# 92. Data Consistency Rules

Critical operations must be transactional/idempotent where appropriate.

Examples:

- An order should not be created twice because of a repeated checkout request.
- A rider should not be assigned to two incompatible deliveries.
- A delivered order cannot return to preparing.
- Payment confirmation must be safely repeatable.
- Inventory/availability changes should be validated before final order confirmation.

---

# 93. Observability

The backend should provide:

- Application logs
- Error tracking
- API monitoring
- Database monitoring
- Realtime connection monitoring
- Payment failure monitoring
- Delivery latency monitoring

Important metrics:

```text
API latency
Error rate
Order creation failures
Payment failures
Realtime disconnects
GPS update failures
Order processing time
Delivery time
```

---

# 94. Recommended Frontend Structure

For a Next.js/React implementation:

```text
src/
├── app/
│   ├── admin/
│   ├── manager/
│   ├── user/
│   ├── rider/
│   ├── login/
│   └── register/
│
├── components/
│   ├── ui/
│   ├── dashboard/
│   ├── orders/
│   ├── restaurant/
│   ├── menu/
│   ├── rider/
│   └── maps/
│
├── hooks/
├── services/
├── types/
├── utils/
├── constants/
├── mockdata/
└── styles/
```

---

# 95. Recommended Backend Structure

For Node.js/Express or NestJS:

```text
src/
├── modules/
│   ├── auth/
│   ├── users/
│   ├── restaurants/
│   ├── menu/
│   ├── orders/
│   ├── payments/
│   ├── riders/
│   ├── deliveries/
│   ├── locations/
│   ├── notifications/
│   ├── reviews/
│   └── admin/
│
├── common/
│   ├── guards/
│   ├── middleware/
│   ├── validators/
│   ├── errors/
│   └── utils/
│
├── realtime/
├── config/
└── database/
```

---

# 96. Recommended Technology Stack

## Frontend

- Next.js
- TypeScript
- Tailwind CSS
- React
- Framer Motion where useful
- TanStack Query for server-state management
- Zustand/Context where appropriate

## Backend

- Node.js
- Express or NestJS
- TypeScript

## Database

Recommended:

- PostgreSQL for transactional data

Alternative:

- MongoDB if the product architecture strongly benefits from document modeling.

## Realtime

- Socket.IO/WebSockets

## Maps

- Google Maps or Mapbox

## Storage

- S3-compatible object storage or Cloudinary for images.

## Authentication

- Secure cookie-based sessions or short-lived access tokens with refresh-token strategy.

## Payments

- A payment provider appropriate for the target market, such as Razorpay/Stripe depending on business requirements and availability.

---

# 97. Definition of Done

A feature is considered complete when:

1. UI is implemented.
2. Responsive behavior is implemented.
3. Backend API is implemented.
4. Authorization is implemented.
5. Validation is implemented.
6. Loading states exist.
7. Error states exist.
8. Empty states exist.
9. Database operations are tested.
10. Realtime behavior is tested where applicable.
11. Security checks are implemented.
12. Analytics/events are recorded where required.
13. The feature works across supported roles.
14. Acceptance criteria pass.
15. No unauthorized cross-restaurant data access is possible.

---

# 98. Final Product Vision

The finished system should function as a complete restaurant operations and delivery ecosystem rather than four disconnected dashboards.

The key relationship is:

```text
                    ADMIN
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
   RESTAURANTS      USERS         RIDERS
        │             │             │
        │             │             │
        └────── ORDER / DELIVERY ───┘
                      │
                      ▼
              REALTIME SYSTEM
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
       MANAGER      USER        ADMIN
          │
          ▼
        RIDER
```

The most important product principle is **role isolation with shared realtime operational data**:

- Admin controls the platform.
- Manager controls their restaurant and its riders.
- User controls their ordering experience.
- Rider controls their delivery workflow.
- The backend remains the source of truth.
- Realtime services keep operational dashboards synchronized.
- Authorization ensures that each role sees only the data it is allowed to access.
