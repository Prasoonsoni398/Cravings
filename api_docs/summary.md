<a name="api-summary"></a>
# API Summary

| Module | Section | Method | Endpoint | Description |
|---|---|---|---|---|
| Auth | Registration & Authentication | POST | `/auth/register` | Creates a new user account |
| Auth | Registration & Authentication | POST | `/auth/login` | Authenticates a user and issues session tokens |
| Auth | Registration & Authentication | GET | `/auth/logout` | Terminates a user's active session |
| Auth | Password Management | POST | `/auth/send-otp` | Generates and sends a password reset OTP via email |
| Auth | Password Management | POST | `/auth/verify-otp` | Verifies the OTP to authorize a password reset |
| Auth | Password Management | POST | `/auth/reset-password` | Updates the user's password using the OTP token |
| Public | Directory | GET | `/public/restaurants` | Fetches a static list of restaurants |
| Public | Support | POST | `/public/contact` | Submits a user inquiry or message |
| Common | Profile Management | PUT | `/common/edit-profile` | Updates the authenticated user's profile information |
| Common | Security | PATCH | `/common/change-password` | Allows an authenticated user to change their password |
| Customer | Order Management | POST | `/orders/` | Places a new food order |
| Customer | Order Management | GET | `/orders/my` | Retrieves order history for the current user |
| Restaurant | Restaurant Information | GET | `/restaurant/get-restaurant-data` | Fetches details of a specific managed restaurant |
| Restaurant | Restaurant Information | POST, PUT | `/restaurant/update-profile` | Creates or updates core foundational details |
| Restaurant | Address & Location | POST, PUT | `/restaurant/update-profile` | Creates or updates physical address and coordinates |
| Restaurant | Contact Information | POST, PUT | `/restaurant/update-profile` | Updates public contact email and phone |
| Restaurant | Documents & Legal | POST, PUT | `/restaurant/update-profile` | Uploads compliance and legal documentation details |
| Restaurant | Financial Information | POST, PUT | `/restaurant/update-profile` | Sets the payout and banking details |
| Restaurant | Social Links | POST, PUT | `/restaurant/update-profile` | Configures social media presence URLs |
| Restaurant | Media & Photos | POST, PUT | `/restaurant/update-profile` | Uploads and manages cover image and gallery |
