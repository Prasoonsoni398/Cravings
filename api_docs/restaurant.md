<a name="module-restaurant"></a>
# Module
Restaurant

# Business Section
Restaurant Information

# Endpoint Name
Get Restaurant Data

# Purpose
Fetches details of a specific restaurant managed by the user.

# Description
Allows an authenticated restaurant manager to retrieve the profile data of their restaurant. Validates that the requested manager ID matches the logged-in user.

### HTTP Method
GET

### Endpoint URL
`/restaurant/get-restaurant-data`
(Also mapped to `/restaurant/get-resturant-data`)

### Authentication
Restaurant Auth Middleware (`RestaurantAuthProtect`) using tokens.

### Headers
None

### Path Parameters
None

### Query Parameters
| Parameter | Type | Required | Description |
|---|---|---|---|
| id | String | Yes | The ID of the manager |

### Request Body
None

### Validation Rules
- **Ownership**: The `id` query parameter must exactly match the stringified `req.user._id`.

### Business Rules
- **Verification**: Explicitly prevents users from fetching restaurant data for other managers by throwing a 401 Unauthorized error if IDs don't match.
- **Graceful Fallback**: If no restaurant is found for the manager, it returns an HTTP 200 with an empty data object, rather than throwing a 404.

### Files Upload
None

### Success Response
```json
{
  "message": "Restaurant Fetched Successfully",
  "data": {
    "_id": "...",
    "managerId": "...",
    "restaurantName": "...",
    "status": "inactive"
  }
}
```
| Field | Type | Description |
|---|---|---|
| message | String | Success message or "No restaurant Data Found" |
| data | Object | The restaurant document or an empty object `{}` |

### Error Responses
**Status Code**: 401
**Message**: Unauthorized Access
```json
{
  "message": "Unauthorized Access"
}
```

### Database
- **Models Used**: `Restaurant`
- **Collections Used**: `restaurants`

### Controller
- **Controller File**: `src/controller/restaurant.controller.js`
- **Controller Function**: `RestaurantGetData`

### Notes
Supports a typo URL variant `/get-resturant-data`.

---

# Module
Restaurant

# Business Section
Restaurant Information

# Endpoint Name
Update Restaurant Details

# Purpose
Creates or updates the core foundational details of a restaurant.

# Description
This endpoint handles updating various fields for a restaurant profile using `multipart/form-data`. This specific documentation section covers updating basic information like the restaurant's name, description, cuisine types, and operating status. If the restaurant doesn't exist for the manager yet, it will be created.

### HTTP Method
POST, PUT

### Endpoint URL
`/restaurant/update-profile`

### Authentication
Restaurant Auth Middleware (`RestaurantAuthProtect`).

### Headers
| Header | Required | Description |
|---|---|---|
| Content-Type | Yes | `multipart/form-data` |

### Path Parameters
None

### Query Parameters
None

### Request Body
| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| restaurantName | String | No | - | Name of the restaurant |
| description | String | No | - | Description of the restaurant |
| restaurantType | String | No | - | Type of restaurant (veg, non-veg, jain, vegan, both) |
| cuisineTypes | JSON/String | No | - | Array of cuisine types. Can be parsed from JSON string or comma-separated string |
| servingHours | JSON String | No | - | JSON object containing openingTime and closingTime |
| isOpen | String | No | "false" | "true" or "false" boolean string indicating if it is currently open |

### Validation Rules
- None strictly enforced in the controller; relies on Mongoose validation if creating a new document. Updates simply overwrite provided fields.

### Business Rules
- **Creation vs Update**: Checks if a restaurant already exists for `req.user._id`. If not, creates a new one. If it does, updates the existing record.
- **Normalization**: Trims whitespace on all incoming string fields. Ignores empty strings.
- **Data Parsing**: Safely attempts to parse `cuisineTypes` as JSON. If that fails, it splits by comma and trims. Safely parses `servingHours` as a JSON object. Converts `isOpen` string to a true boolean.

### Files Upload
None utilized in this logical section, though the endpoint supports them.

### Success Response
```json
{
  "message": "Restaurant profile updated successfully",
  "data": {
    "_id": "...",
    "restaurantName": "..."
  }
}
```
| Field | Type | Description |
|---|---|---|
| message | String | Success confirmation message |
| data | Object | The created or updated restaurant document |

### Error Responses
**Status Code**: 500
**Message**: Internal Sever Error
```json
{
  "message": "Internal Sever Error"
}
```

### Database
- **Models Used**: `Restaurant`
- **Collections Used**: `restaurants`

### Controller
- **Controller File**: `src/controller/restaurant.controller.js`
- **Controller Function**: `restaurantUpdateProfile`

### Notes
Supports both POST and PUT methods.

---

# Module
Restaurant

# Business Section
Address & Location

# Endpoint Name
Update Address Details

# Purpose
Creates or updates the physical address and geographical location of the restaurant.

# Description
Handles `multipart/form-data` updates pertaining to the restaurant's physical address, city, state, postal code, and latitude/longitude coordinates. 

### HTTP Method
POST, PUT

### Endpoint URL
`/restaurant/update-profile`

### Authentication
Restaurant Auth Middleware (`RestaurantAuthProtect`).

### Headers
| Header | Required | Description |
|---|---|---|
| Content-Type | Yes | `multipart/form-data` |

### Path Parameters
None

### Query Parameters
None

### Request Body
| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| address | String | No | - | Street address |
| city | String | No | - | City name |
| state | String | No | - | State or province |
| pinCode | String | No | - | Postal/ZIP code |
| country | String | No | - | Country name |
| geoLocation | JSON String | No | - | JSON string representing an object with `lat` and `lon` keys |

### Validation Rules
- Unprovided fields are safely ignored.

### Business Rules
- **Data Parsing**: Safely attempts to parse the `geoLocation` string into a JSON object. If invalid JSON, it falls back to saving it as a raw string.
- Automatically handles creating a new restaurant profile if it doesn't already exist for the manager.

### Files Upload
None utilized in this logical section.

### Success Response
```json
{
  "message": "Restaurant profile updated successfully",
  "data": { ... }
}
```
| Field | Type | Description |
|---|---|---|
| message | String | Success confirmation message |
| data | Object | The created or updated restaurant document |

### Error Responses
(Identical 500 error structure as other sections of this endpoint)

### Database
- **Models Used**: `Restaurant`
- **Collections Used**: `restaurants`

### Controller
- **Controller File**: `src/controller/restaurant.controller.js`
- **Controller Function**: `restaurantUpdateProfile`

### Notes
None

---

# Module
Restaurant

# Business Section
Contact Information

# Endpoint Name
Update Contact Details

# Purpose
Updates the restaurant's public contact information.

# Description
Receives a JSON stringified object representing the restaurant's support email and phone number.

### HTTP Method
POST, PUT

### Endpoint URL
`/restaurant/update-profile`

### Authentication
Restaurant Auth Middleware (`RestaurantAuthProtect`).

### Headers
| Header | Required | Description |
|---|---|---|
| Content-Type | Yes | `multipart/form-data` |

### Path Parameters
None

### Query Parameters
None

### Request Body
| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| contactDetails | JSON String | No | - | JSON string mapping to `{ email, phone }` |

### Validation Rules
- Unprovided fields are ignored.

### Business Rules
- **Data Parsing**: Safely parses the `contactDetails` string into a JSON object via `try/catch`. 

### Files Upload
None

### Success Response
```json
{
  "message": "Restaurant profile updated successfully",
  "data": { ... }
}
```
| Field | Type | Description |
|---|---|---|
| message | String | Success confirmation |
| data | Object | Updated restaurant document |

### Error Responses
(Identical 500 error structure as other sections of this endpoint)

### Database
- **Models Used**: `Restaurant`
- **Collections Used**: `restaurants`

### Controller
- **Controller File**: `src/controller/restaurant.controller.js`
- **Controller Function**: `restaurantUpdateProfile`

### Notes
None

---

# Module
Restaurant

# Business Section
Documents & Legal

# Endpoint Name
Update Documents

# Purpose
Uploads or updates the legal entity and compliance documentation references for the restaurant.

# Description
Accepts stringified JSON mapping to the restaurant's legal name, company type, and certificates required for platform compliance.

### HTTP Method
POST, PUT

### Endpoint URL
`/restaurant/update-profile`

### Authentication
Restaurant Auth Middleware (`RestaurantAuthProtect`).

### Headers
| Header | Required | Description |
|---|---|---|
| Content-Type | Yes | `multipart/form-data` |

### Path Parameters
None

### Query Parameters
None

### Request Body
| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| documents | JSON String | No | - | JSON string mapping to `{ legalName, companyType, gstCertificate, fssaiCertificate, panCard }` |

### Validation Rules
- Passed fields update the object. Missing fields are ignored.

### Business Rules
- **Data Parsing**: Parses `documents` payload into a JSON object.

### Files Upload
None

### Success Response
```json
{
  "message": "Restaurant profile updated successfully",
  "data": { ... }
}
```
| Field | Type | Description |
|---|---|---|
| message | String | Success confirmation |
| data | Object | Updated restaurant document |

### Error Responses
(Identical 500 error structure as other sections of this endpoint)

### Database
- **Models Used**: `Restaurant`
- **Collections Used**: `restaurants`

### Controller
- **Controller File**: `src/controller/restaurant.controller.js`
- **Controller Function**: `restaurantUpdateProfile`

### Notes
None

---

# Module
Restaurant

# Business Section
Financial Information

# Endpoint Name
Update Financial Details

# Purpose
Sets the payout and banking details for the restaurant.

# Description
Updates the bank name, account number, and routing codes via a JSON string payload.

### HTTP Method
POST, PUT

### Endpoint URL
`/restaurant/update-profile`

### Authentication
Restaurant Auth Middleware (`RestaurantAuthProtect`).

### Headers
| Header | Required | Description |
|---|---|---|
| Content-Type | Yes | `multipart/form-data` |

### Path Parameters
None

### Query Parameters
None

### Request Body
| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| financialDetails | JSON String | No | - | JSON string mapping to `{ bankName, accountNumber, ifscCode }` |

### Validation Rules
- Passed fields update the object.

### Business Rules
- **Data Parsing**: Parses `financialDetails` payload into a JSON object.

### Files Upload
None

### Success Response
```json
{
  "message": "Restaurant profile updated successfully",
  "data": { ... }
}
```
| Field | Type | Description |
|---|---|---|
| message | String | Success confirmation |
| data | Object | Updated restaurant document |

### Error Responses
(Identical 500 error structure as other sections of this endpoint)

### Database
- **Models Used**: `Restaurant`
- **Collections Used**: `restaurants`

### Controller
- **Controller File**: `src/controller/restaurant.controller.js`
- **Controller Function**: `restaurantUpdateProfile`

### Notes
None

---

# Module
Restaurant

# Business Section
Social Links

# Endpoint Name
Update Social Links

# Purpose
Configures the restaurant's social media presence URLs.

# Description
Takes an array of objects representing various social platforms and their corresponding URLs.

### HTTP Method
POST, PUT

### Endpoint URL
`/restaurant/update-profile`

### Authentication
Restaurant Auth Middleware (`RestaurantAuthProtect`).

### Headers
| Header | Required | Description |
|---|---|---|
| Content-Type | Yes | `multipart/form-data` |

### Path Parameters
None

### Query Parameters
None

### Request Body
| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| socialMediaLinks | JSON String | No | - | JSON string representing an array of objects mapping to `[{ platform, url }]` |

### Validation Rules
- Passed fields update the object.

### Business Rules
- **Data Parsing**: Parses `socialMediaLinks` payload into an Array of JSON objects.

### Files Upload
None

### Success Response
```json
{
  "message": "Restaurant profile updated successfully",
  "data": { ... }
}
```
| Field | Type | Description |
|---|---|---|
| message | String | Success confirmation |
| data | Object | Updated restaurant document |

### Error Responses
(Identical 500 error structure as other sections of this endpoint)

### Database
- **Models Used**: `Restaurant`
- **Collections Used**: `restaurants`

### Controller
- **Controller File**: `src/controller/restaurant.controller.js`
- **Controller Function**: `restaurantUpdateProfile`

### Notes
None

---

# Module
Restaurant

# Business Section
Media & Photos

# Endpoint Name
Update Media

# Purpose
Uploads and manages the restaurant's cover image and photo gallery.

# Description
This section of the update endpoint specifically manages file uploads for the restaurant's visual representation. It accepts a single cover image and an array of gallery images. Previous images stored in Cloudinary are gracefully deleted to save storage space.

### HTTP Method
POST, PUT

### Endpoint URL
`/restaurant/update-profile`

### Authentication
Restaurant Auth Middleware (`RestaurantAuthProtect`).

### Headers
| Header | Required | Description |
|---|---|---|
| Content-Type | Yes | `multipart/form-data` |

### Path Parameters
None

### Query Parameters
None

### Request Body
None (Form data handled via Files Upload section)

### Validation Rules
- **File limits**: Max 1 file for `coverImage`. Max 8 to 10 files for `restaurantImage` (depending on route configuration).

### Business Rules
- **Image Deletion**: Checks if the existing restaurant document has old images (`coverImage` object or `restaurantImage` array). If new files are provided in the request, it invokes `deleteSingleImage` and `deleteMultipleImages` utilities to prune the old assets from Cloudinary.
- **Image Upload**: Uploads new files via `UploadSingleImage` and `uploadMultipleImages` using custom folder paths containing the manager's phone number.
- Assigns the new Cloudinary URLs and Public IDs to the restaurant object.

### Files Upload
| Field | File Type | Multiple | Required |
|---|---|---|---|
| coverImage | Image | No | No |
| restaurantImage | Image | Yes (up to 10) | No |

### Success Response
```json
{
  "message": "Restaurant profile updated successfully",
  "data": { ... }
}
```
| Field | Type | Description |
|---|---|---|
| message | String | Success confirmation |
| data | Object | Updated restaurant document including new image URLs |

### Error Responses
(Identical 500 error structure as other sections of this endpoint)

### Database
- **Models Used**: `Restaurant`
- **Collections Used**: `restaurants`

### Controller
- **Controller File**: `src/controller/restaurant.controller.js`
- **Controller Function**: `restaurantUpdateProfile`

### Notes
The PUT endpoint enforces a limit of 8 images for `restaurantImage`, whereas the POST endpoint enforces a limit of 10 images.

---