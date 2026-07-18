<a name="module-auth"></a>
# Module
Auth

# Business Section
Registration & Authentication

# Endpoint Name
Register User

# Purpose
Creates a new user account in the system.

# Description
This endpoint is used to register a new user. It receives the user's basic details, verifies that the email is not already registered, hashes the provided password for security, and automatically generates a placeholder profile picture URL based on the user's initial. Any unregistered user can use this endpoint.

### HTTP Method
POST

### Endpoint URL
`/auth/register`

### Authentication
Public (No authentication required)

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
| fullName | String | Yes | - | User's full name |
| email | String | Yes | - | User's email address |
| password | String | Yes | - | User's password (will be hashed) |
| phone | String | Yes | - | User's phone number |
| gender | String | Yes | - | User's gender |
| dob | Date/String | Yes | - | User's date of birth |
| userType | Enum | Yes | "customer" | Type of user (`admin`, `customer`, `rider`, `restaurant`) |

### Validation Rules
- **Required**: All fields (`fullName`, `email`, `password`, `phone`, `gender`, `dob`, `userType`) must be present in the request body.
- **Unique**: The `email` must be unique across all existing users.
- **Enum**: `userType` must be one of: `admin`, `customer`, `rider`, `restaurant`.

### Business Rules
- **Duplicate Checks**: Queries the database to verify if a user with the provided email already exists.
- **Image Generation**: Generates a default placeholder image URL using `placehold.co` with the first character of the `fullName`.
- **Password Security**: Hashes the provided password using `bcrypt` with a generated salt (factor 10) before saving to the database.

### Files Upload
None

### Success Response
```json
{
  "message": "User Created Successfully"
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

**Status Code**: 409
**Message**: Email already registred
```json
{
  "message": "Email already registred"
}
```

**Status Code**: 500
**Message**: Internal Sever Error
```json
{
  "message": "Internal Sever Error"
}
```

### Database
- **Models Used**: `User`
- **Collections Used**: `users`

### Controller
- **Controller File**: `src/controller/auth.controller.js`
- **Controller Function**: `RegisterUser`

### Notes
None

---

# Module
Auth

# Business Section
Registration & Authentication

# Endpoint Name
Login User

# Purpose
Authenticates a user and issues session tokens.

# Description
This endpoint is used by registered users to log into the application. It verifies the email and password against the database. If successful, it generates authentication tokens and attaches them to the response cookies. 

### HTTP Method
POST

### Endpoint URL
`/auth/login`

### Authentication
Public (No authentication required to call the endpoint)

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
| email | String | Yes | - | User's registered email address |
| password | String | Yes | - | User's password |

### Validation Rules
- **Required**: Both `email` and `password` are required.

### Business Rules
- **Existence Verification**: Verifies that the email is registered in the database.
- **Password Verification**: Compares the provided password with the hashed password stored in the database using `bcrypt.compare`.
- **Token Generation**: Calls the `genToken` utility to issue cookies containing session tokens upon successful login.

### Files Upload
None

### Success Response
```json
{
  "message": "Welcome Back",
  "data": {
    "_id": "...",
    "fullName": "...",
    "email": "...",
    "phone": "...",
    "gender": "...",
    "userType": "customer",
    "isActive": true,
    "status": "pending",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```
| Field | Type | Description |
|---|---|---|
| message | String | Success welcome message |
| data | Object | The user's document object from the database |

### Error Responses
**Status Code**: 400
**Message**: All fields Required
```json
{
  "message": "All fields Required"
}
```

**Status Code**: 401
**Message**: Incorrect Password
```json
{
  "message": "Incorrect Password"
}
```

**Status Code**: 404
**Message**: Email not registred
```json
{
  "message": "Email not registred"
}
```

### Database
- **Models Used**: `User`
- **Collections Used**: `users`

### Controller
- **Controller File**: `src/controller/auth.controller.js`
- **Controller Function**: `LoginUser`

### Notes
Tokens are generated and stored via HTTP cookies. The exact cookie names are defined in the `genToken` service logic (e.g. `Oreo`, `Cravings`, `kitkat`).

---

# Module
Auth

# Business Section
Registration & Authentication

# Endpoint Name
Logout User

# Purpose
Terminates a user's active session.

# Description
This endpoint logs out the currently authenticated user by clearing the associated authentication cookies from the client's browser. It should be called when a user explicitly chooses to sign out.

### HTTP Method
GET

### Endpoint URL
`/auth/logout`

### Authentication
Public / Any

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
- **Cookie Clearing**: Explicitly clears cookies named `Oreo`, `Cravings`, and `kitkat` by setting their `maxAge` to 0.

### Files Upload
None

### Success Response
```json
{
  "message": "Logout Sucessfully"
}
```
| Field | Type | Description |
|---|---|---|
| message | String | Success confirmation message |

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
- **Controller File**: `src/controller/auth.controller.js`
- **Controller Function**: `LogoutUser`

### Notes
None

---

# Module
Auth

# Business Section
Password Management

# Endpoint Name
Send OTP

# Purpose
Generates and sends a One-Time Password (OTP) for password recovery.

# Description
This endpoint initiates the password reset flow. It generates a random 6-digit OTP, hashes it, stores it in the database associated with the user's email, and triggers an email service to send the plain-text OTP to the user.

### HTTP Method
POST

### Endpoint URL
`/auth/send-otp`

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
| email | String | Yes | - | User's registered email address |

### Validation Rules
- **Required**: `email` field is mandatory.

### Business Rules
- **Existence Verification**: Validates that the provided email exists in the `User` database.
- **OTP Generation**: Generates a random 6-digit numeric string.
- **OTP Deletion**: Checks if an OTP already exists for the email and deletes it to ensure only the latest OTP is valid.
- **OTP Security**: Hashes the generated OTP before saving it to the database.
- **Email Delivery**: Uses `sendOTPEmail` utility to dispatch the OTP email.

### Files Upload
None

### Success Response
```json
{
  "message": "OTP sent on 'user@example.com'"
}
```
| Field | Type | Description |
|---|---|---|
| message | String | Success confirmation message including the target email |

### Error Responses
**Status Code**: 400
**Message**: Email is required
```json
{
  "message": "Email is required"
}
```

**Status Code**: 404
**Message**: Email not registered
```json
{
  "message": "Email not registered"
}
```

### Database
- **Models Used**: `User`, `OTP`
- **Collections Used**: `users`, `otps`

### Controller
- **Controller File**: `src/controller/auth.controller.js`
- **Controller Function**: `SendOtp`

### Notes
The OTP document automatically expires after 5 minutes, as defined by the default value in the OTP schema (`expiresAt`).

---

# Module
Auth

# Business Section
Password Management

# Endpoint Name
Verify OTP

# Purpose
Verifies the submitted OTP to authorize a password reset.

# Description
This endpoint is the second step in the password recovery flow. It compares the provided OTP against the hashed OTP in the database. Upon successful verification, it deletes the OTP and generates a special OTP token allowing the user to reset their password.

### HTTP Method
POST

### Endpoint URL
`/auth/verify-otp`

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
| email | String | Yes | - | User's email address |
| otp | String | Yes | - | The 6-digit OTP received via email |

### Validation Rules
- **Required**: `email` is explicitly checked for existence. `otp` is implicitly required for bcrypt comparison.

### Business Rules
- **Existence Verification**: Finds the OTP document by email. If none exists, assumes expiration or invalid request.
- **OTP Verification**: Uses `bcrypt.compare` to validate the plaintext OTP against the stored hash.
- **Cleanup**: Deletes the OTP document immediately after successful verification to prevent reuse.
- **Token Generation**: Calls `genOTPToken` to issue cookies authorizing the actual password reset step.

### Files Upload
None

### Success Response
```json
{
  "message": "OTP verified. Create You New Password Now"
}
```
| Field | Type | Description |
|---|---|---|
| message | String | Success message instructing the user to proceed |

### Error Responses
**Status Code**: 400
**Message**: Email is required
```json
{
  "message": "Email is required"
}
```

**Status Code**: 401
**Message**: OTP Expired
```json
{
  "message": "OTP Expired"
}
```

**Status Code**: 404
**Message**: Email not registered
```json
{
  "message": "Email not registered"
}
```

### Database
- **Models Used**: `User`, `OTP`
- **Collections Used**: `users`, `otps`

### Controller
- **Controller File**: `src/controller/auth.controller.js`
- **Controller Function**: `VerifyOtp`

### Notes
Returns a 401 status for incorrect OTPs but labels the error message as "OTP Expired" due to implementation design.

---

# Module
Auth

# Business Section
Password Management

# Endpoint Name
Reset Password

# Purpose
Updates the user's password using the temporary OTP token.

# Description
This is the final step in the password recovery flow. The user submits a new password, which is hashed and saved to their account. The request is authorized by the `OTPAuthProtect` middleware, ensuring the user recently verified an OTP.

### HTTP Method
POST

### Endpoint URL
`/auth/reset-password`

### Authentication
OTP Auth Middleware (`OTPAuthProtect`) parsing tokens from cookies.

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
| newPassword | String | Yes | - | The user's new desired password |

### Validation Rules
None explicitly in controller (relies on mongoose/schema level or frontend).

### Business Rules
- **Password Security**: Hashes the `newPassword` using `bcrypt` (factor 10).
- **Update**: Replaces the `password` field on the authenticated `req.user` object and saves the user document.

### Files Upload
None

### Success Response
```json
{
  "message": "Password Changed"
}
```
| Field | Type | Description |
|---|---|---|
| message | String | Success confirmation message |

### Error Responses
**Status Code**: 500
**Message**: Internal Sever Error
```json
{
  "message": "Internal Sever Error"
}
```

### Database
- **Models Used**: `User`
- **Collections Used**: `users`

### Controller
- **Controller File**: `src/controller/auth.controller.js`
- **Controller Function**: `ResetPassword`

### Notes
Requires cookies set by `/auth/verify-otp`.

---