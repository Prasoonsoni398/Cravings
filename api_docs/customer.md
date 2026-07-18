<a name="module-customer"></a>
# Module
Customer

# Business Section
Order Management

# Endpoint Name
Create Order

# Purpose
Places a new food order.

# Description
Allows authenticated users to create a new order containing items from a specific restaurant. It validates the required payloads and associates the order with the user's ID.

### HTTP Method
POST

### Endpoint URL
`/orders/`

### Authentication
Auth Middleware (`AuthProtect`) using tokens.

### Headers
| Header | Required | Description |
|---|---|---|
| Content-Type | Yes | `application/json` |

### Path Parameters
None

### Query Parameters
None

### Request Body
| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| restaurantId | String (ObjectId) | Yes | - | ID of the restaurant being ordered from |
| restaurantName | String | Yes | - | Name of the restaurant |
| items | Array | Yes | - | List of order items (requires `length > 0`) |
| totalPrice | Number | No | - | Total price of the order |
| deliveryAddress | Object | Yes | - | Object containing delivery details |
| userId | String (ObjectId) | No | - | User ID (fallback if not in req.user) |

### Validation Rules
- **Required**: `restaurantId`, `restaurantName`, `items`, and `deliveryAddress` must be provided. The `items` array must have a length greater than 0.

### Business Rules
- **User Identification**: Uses `req.user._id` from the auth middleware, or falls back to `req.body.userId`.
- Saves the order record as pending in the database. 
- *Note: `items`, `totalPrice`, and `restaurantName` passed in request do not perfectly align with the current strict Mongoose schema for `Order` (`orderItems`, `billDetails`), meaning these fields may be dropped or stored dynamically based on Mongoose settings.*

### Files Upload
None

### Success Response
```json
{
  "message": "Order placed successfully",
  "data": {
    "_id": "...",
    "restaurantId": "...",
    "customerId": "...",
    "orderStatus": "pending",
    "createdAt": "..."
  }
}
```
| Field | Type | Description |
|---|---|---|
| message | String | Success confirmation message |
| data | Object | The created order document |

### Error Responses
**Status Code**: 400
**Message**: Please provide restaurant, items, and delivery address
```json
{
  "message": "Please provide restaurant, items, and delivery address"
}
```

### Database
- **Models Used**: `Order`
- **Collections Used**: `orders`

### Controller
- **Controller File**: `src/controller/order.controller.js`
- **Controller Function**: `CreateOrder`

### Notes
The model schema defines `customerId`, but the controller assigns the user's ID to `userId` during `.create()`.

---

# Module
Customer

# Business Section
Order Management

# Endpoint Name
Get My Orders

# Purpose
Retrieves order history for the current user.

# Description
Fetches a list of all orders associated with the authenticated user, sorted by creation date in descending order (newest first).

### HTTP Method
GET

### Endpoint URL
`/orders/my`

### Authentication
Auth Middleware (`AuthProtect`) using tokens.

### Headers
None

### Path Parameters
None

### Query Parameters
| Parameter | Type | Required | Description |
|---|---|---|---|
| userId | String | No | Fallback ID if middleware doesn't populate `req.user._id` |

### Request Body
None

### Validation Rules
- **Required**: A valid `userId` must be resolvable (from token or query).

### Business Rules
- **Sorting**: Enforces `.sort({ createdAt: -1 })` to return newest orders first.

### Files Upload
None

### Success Response
```json
{
  "message": "Orders fetched successfully",
  "data": [
    {
      "_id": "...",
      "restaurantId": "...",
      "orderStatus": "pending",
      "createdAt": "..."
    }
  ]
}
```
| Field | Type | Description |
|---|---|---|
| message | String | Success message |
| data | Array | Array of the user's order documents |

### Error Responses
**Status Code**: 401
**Message**: User not authenticated
```json
{
  "message": "User not authenticated"
}
```

### Database
- **Models Used**: `Order`
- **Collections Used**: `orders`

### Controller
- **Controller File**: `src/controller/order.controller.js`
- **Controller Function**: `GetMyOrders`

### Notes
Queries the database using `userId`.

---