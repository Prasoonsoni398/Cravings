<a name="module-public"></a>
# Module
Public

# Business Section
Directory

# Endpoint Name
Get Restaurants

# Purpose
Fetches a list of available restaurants.

# Description
Provides a public feed of restaurants. Currently, this endpoint serves a static array of mock restaurant data to the client for display purposes.

### HTTP Method
GET

### Endpoint URL
`/public/restaurants`

### Authentication
Public

### Headers
None

### Path Parameters
None

### Query Parameters
None

### Request Body
None

### Validation Rules
None

### Business Rules
- Returns a statically defined array of restaurants directly from the controller file.

### Files Upload
None

### Success Response
```json
{
  "message": "Restaurants fetched successfully",
  "data": [
    {
      "id": "mango-tree",
      "name": "Under The Mango Tree",
      "rating": "4.6",
      "image": "...",
      "description": "...",
      "cuisines": ["Indian", "Chinese", "Italian"],
      "city": "Bhopal",
      "deliveryTime": "25-35 min",
      "price": "₹300 for two",
      "menu": ["Paneer Tikka", "Dal Makhani", "Butter Naan", "Veg Biryani"]
    }
  ]
}
```
| Field | Type | Description |
|---|---|---|
| message | String | Success message |
| data | Array | Array of mock restaurant objects |

### Error Responses
**Status Code**: 500
**Message**: Internal Sever Error
```json
{
  "message": "Internal Sever Error"
}
```

### Database
None

### Controller
- **Controller File**: `src/controller/public.controller.js`
- **Controller Function**: `GetRestaurants`

### Notes
This endpoint currently relies on static data, not the database.

---

# Module
Public

# Business Section
Support

# Endpoint Name
Contact Us

# Purpose
Submits a user message or inquiry to the platform.

# Description
Allows users or visitors to submit a contact form with their details and a message. The data is saved directly into the database for administrative review.

### HTTP Method
POST

### Endpoint URL
`/public/contact`
(Also mapped to `/public/contactUs`)

### Authentication
Public

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
| fullName | String | Yes | - | Sender's full name |
| email | String | Yes | - | Sender's email address |
| phone | String | Yes | - | Sender's phone number |
| subject | String | Yes | - | Subject of the inquiry |
| message | String | Yes | - | Detailed body of the message |

### Validation Rules
- **Required**: All fields (`fullName`, `email`, `phone`, `subject`, `message`) must be provided.

### Business Rules
- Saves the provided data into the `Contact` model.

### Files Upload
None

### Success Response
```json
{
  "message": "Thanks for Contacting us! You will hear back from us soon"
}
```
| Field | Type | Description |
|---|---|---|
| message | String | Success confirmation message |

### Error Responses
**Status Code**: 400
**Message**: All fields Required
```json
{
  "message": "All fields Required"
}
```

### Database
- **Models Used**: `Contact`
- **Collections Used**: `contacts`

### Controller
- **Controller File**: `src/controller/public.controller.js`
- **Controller Function**: `ContactUsForm`

### Notes
Both paths `/public/contact` and `/public/contactUs` point to the exact same controller function.

---