<a name="module-common"></a>
# Module
Common

# Business Section
Profile Management

# Endpoint Name
Edit Profile

# Purpose
Updates the authenticated user's profile information.

# Description
Allows a user to update their email, full name, phone number, and display picture. It handles image uploading to Cloudinary, ensuring older images are deleted before the new one is saved. It also verifies email uniqueness if the user attempts to change their email.

### HTTP Method
PUT

### Endpoint URL
`/common/edit-profile`

### Authentication
Auth Middleware (`AuthProtect`) using tokens.

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
| email | String | No | - | New email address |
| fullName | String | No | - | New full name |
| phone | String | No | - | New phone number |
| userId | String | No | - | User ID (fallback if not in req.user) |

### Validation Rules
- **Required**: At least one of the fields (`fullName`, `phone`, `email`, or `displayPic` file) must be provided in the request.
- **Unique**: If `email` is updated, the new email must not already belong to another user.

### Business Rules
- **User Identification**: Resolves the user ID from `req.user._id` (set by middleware) or falls back to `req.body.userId`.
- **Email Change Logic**: Normalizes the email to lowercase and trims spaces. Checks the database to ensure the email doesn't belong to another user (`_id: { $ne: currentUserId }`).
- **Image Replacement**: If a new photo is uploaded, it checks if an existing photo `publicId` exists. If so, it calls Cloudinary's `destroy` method to delete the old image.
- **Image Upload**: Uploads the new image buffer to Cloudinary in the `cravings/users` folder and saves the new `url` and `publicId`.
- **String Trimming**: Automatically trims whitespace for `fullName` and `phone`.

### Files Upload
| Field | File Type | Multiple | Required |
|---|---|---|---|
| displayPic | Image | No | No |

### Success Response
```json
{
  "message": "User Updated Successfully",
  "data": {
    "_id": "...",
    "fullName": "...",
    "email": "...",
    "phone": "...",
    "photo": {
      "url": "...",
      "publicId": "..."
    }
  }
}
```
| Field | Type | Description |
|---|---|---|
| message | String | Success message |
| data | Object | The updated user document |

### Error Responses
**Status Code**: 400
**Message**: Please provide at least one field to update
```json
{
  "message": "Please provide at least one field to update"
}
```

**Status Code**: 404
**Message**: User not found
```json
{
  "message": "User not found"
}
```

**Status Code**: 409
**Message**: Email already registered
```json
{
  "message": "Email already registered"
}
```

### Database
- **Models Used**: `User`
- **Collections Used**: `users`

### Controller
- **Controller File**: `src/controller/common.controller.js`
- **Controller Function**: `EditUserProfile`

### Notes
Uses `multer` middleware named `Upload.single("displayPic")` to parse the file before it reaches the controller.

---

# Module
Common

# Business Section
Security

# Endpoint Name
Change Password

# Purpose
Allows an authenticated user to change their password.

# Description
This endpoint lets users securely update their current password. It requires the old password to verify authorization, hashes the new password, and applies a deliberate time delay to mitigate brute force attacks before returning the response.

### HTTP Method
PATCH

### Endpoint URL
`/common/change-password`

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
| oldPassword | String | Yes | - | The user's current password |
| newPassword | String | Yes | - | The new desired password |

### Validation Rules
- **Required**: Both `oldPassword` and `newPassword` are required.

### Business Rules
- **Password Verification**: Uses `bcrypt.compare` to verify the provided `oldPassword` matches the hash stored in `req.user.password`.
- **Password Security**: Hashes the `newPassword` using `bcrypt` (factor 10) before saving.
- **Rate Limiting/Delay**: Introduces an artificial 3000 millisecond (3 seconds) delay using a Promise timeout before dispatching the HTTP response.

### Files Upload
None

### Success Response
```json
{
  "message": "Password updated successfully"
}
```
| Field | Type | Description |
|---|---|---|
| message | String | Success confirmation message |

### Error Responses
**Status Code**: 400
**Message**: All fields Required / Old password is incorrect
```json
{
  "message": "All fields Required"
}
```
```json
{
  "message": "Old password is incorrect"
}
```

### Database
- **Models Used**: `User`
- **Collections Used**: `users`

### Controller
- **Controller File**: `src/controller/common.controller.js`
- **Controller Function**: `UpdateUserPassword`

### Notes
Relies heavily on `req.user` populated by the `AuthProtect` middleware.

---