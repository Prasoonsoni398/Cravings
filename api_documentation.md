# Comprehensive API Documentation

Based on the existing codebase and the database schemas (User, Restaurant, Order, Rider, Menu), here is the detailed API documentation including both the **already implemented** endpoints and the **required (proposed)** endpoints for a complete restaurant system.

## 1. Auth (Implemented)

| Component | Method | API Endpoint           | Request Body                                                  | Response Body                 | Success Message                             | Error Message                                                      |
| :-------- | :----- | :--------------------- | :------------------------------------------------------------ | :---------------------------- | :------------------------------------------ | :----------------------------------------------------------------- |
| Auth      | POST   | `/auth/register`       | `{ fullName, email, password, phone, gender, dob, userType }` | `{ message }`                 | "User Created Successfully"                 | "All fields Required", "Email already registred"                   |
| Auth      | POST   | `/auth/login`          | `{ email, password }`                                         | `{ message, data: { user } }` | "Welcome Back"                              | "All fields Required", "Email not registred", "Incorrect Password" |
| Auth      | GET    | `/auth/logout`         | None                                                          | `{ message }`                 | "Logout Sucessfully"                        | -                                                                  |
| Auth      | POST   | `/auth/send-otp`       | `{ email }`                                                   | `{ message }`                 | "OTP sent on '[email]'"                     | "Email is required", "Email not registered"                        |
| Auth      | POST   | `/auth/verify-otp`     | `{ email, otp }`                                              | `{ message }`                 | "OTP verified. Create You New Password Now" | "Email is required", "OTP Expired", "Email not registered"         |
| Auth      | POST   | `/auth/reset-password` | `{ newPassword }`                                             | `{ message }`                 | "Password Changed"                          | -                                                                  |

## 2. Common (Implemented)

| Component | Method | API Endpoint              | Request Body                                         | Response Body                 | Success Message                 | Error Message                                                   |
| :-------- | :----- | :------------------------ | :--------------------------------------------------- | :---------------------------- | :------------------------------ | :-------------------------------------------------------------- |
| Common    | PUT    | `/common/edit-profile`    | FormData: `email`, `fullName`, `phone`, `displayPic` | `{ message, data: { user } }` | "User Updated Successfully"     | "Please provide at least one field to update", "User not found" |
| Common    | PATCH  | `/common/change-password` | `{ oldPassword, newPassword }`                       | `{ message }`                 | "Password updated successfully" | "Old password is incorrect"                                     |

## 3. Public (Implemented)

| Component | Method | API Endpoint          | Request Body                                   | Response Body                        | Success Message                    | Error Message         |
| :-------- | :----- | :-------------------- | :--------------------------------------------- | :----------------------------------- | :--------------------------------- | :-------------------- |
| Public    | GET    | `/public/restaurants` | None                                           | `{ message, data: [ restaurants ] }` | "Restaurants fetched successfully" | -                     |
| Public    | POST   | `/public/contactUs`   | `{ fullName, email, phone, subject, message }` | `{ message }`                        | "Thanks for Contacting us!"        | "All fields Required" |

## 4. Restaurant (Mixed)

| Component  | Method | API Endpoint                                | Request Body                                               | Response Body                       | Success Message                           | Error Message                       |
| :--------- | :----- | :------------------------------------------ | :--------------------------------------------------------- | :---------------------------------- | :---------------------------------------- | :---------------------------------- |
| Restaurant | POST   | `/restaurant/update-profile`                | FormData: `coverImage`, `restaurantImage`, documents, etc. | `{ message, data: { restaurant } }` | "Restaurant profile created successfully" | -                                   |
| Restaurant | PUT    | `/restaurant/update-profile`                | FormData: `coverImage`, `restaurantImage`, documents, etc. | `{ message, data: { restaurant } }` | "Restaurant profile updated successfully" | -                                   |
| Restaurant | GET    | `/restaurant/get-restaurant-data`           | Query: `?id={managerId}`                                   | `{ message, data: { restaurant } }` | "Restaurant Fetched Successfully"         | "Unauthorized Access"               |
| Restaurant | POST   | `/restaurant/menu` _(Required)_             | `{ menuItems: [...] }`                                     | `{ message, data: { menu } }`       | "Menu items added successfully"           | "Invalid menu data"                 |
| Restaurant | PUT    | `/restaurant/menu/:itemId` _(Required)_     | `{ itemName, price, category, ... }`                       | `{ message, data: { item } }`       | "Menu item updated"                       | "Item not found"                    |
| Restaurant | DELETE | `/restaurant/menu/:itemId` _(Required)_     | None                                                       | `{ message }`                       | "Menu item deleted"                       | "Item not found"                    |
| Restaurant | GET    | `/restaurant/orders` _(Required)_           | None                                                       | `{ message, data: [ orders ] }`     | "Orders fetched"                          | -                                   |
| Restaurant | PATCH  | `/restaurant/order/:id/status` _(Required)_ | `{ orderStatus: 'accepted' \| 'preparing' \| 'ready' }`    | `{ message, data: { order } }`      | "Order status updated"                    | "Invalid status", "Order not found" |

## 5. Customer (Mixed)

| Component | Method | API Endpoint                                 | Request Body                                                           | Response Body                        | Success Message                    | Error Message                         |
| :-------- | :----- | :------------------------------------------- | :--------------------------------------------------------------------- | :----------------------------------- | :--------------------------------- | :------------------------------------ |
| Customer  | GET    | `/customer/restaurants` _(Required)_         | Query: `?city`, `?cuisine`                                             | `{ message, data: [ restaurants ] }` | "Restaurants fetched successfully" | -                                     |
| Customer  | GET    | `/customer/restaurant/:id/menu` _(Required)_ | None                                                                   | `{ message, data: { menu } }`        | "Menu fetched successfully"        | "Restaurant not found"                |
| Customer  | POST   | `/orders/`                                   | `{ restaurantId, restaurantName, items, totalPrice, deliveryAddress }` | `{ message, data: { order } }`       | "Order placed successfully"        | "Please provide restaurant, items..." |
| Customer  | GET    | `/orders/my`                                 | None                                                                   | `{ message, data: [ orders ] }`      | "Orders fetched successfully"      | "User not authenticated"              |
| Customer  | PATCH  | `/orders/:id/cancel` _(Required)_            | None                                                                   | `{ message, data: { order } }`       | "Order cancelled successfully"     | "Cannot cancel active order"          |
| Customer  | POST   | `/orders/:id/rate` _(Required)_              | `{ rating: 1-5 }`                                                      | `{ message }`                        | "Rating submitted successfully"    | "Order not found", "Invalid rating"   |

## 6. Rider (Required/Proposed)

| Component | Method | API Endpoint              | Request Body                                                                  | Response Body                   | Success Message           | Error Message               |
| :-------- | :----- | :------------------------ | :---------------------------------------------------------------------------- | :------------------------------ | :------------------------ | :-------------------------- |
| Rider     | POST   | `/rider/profile`          | FormData: `vehicleDetails`, `documents`, `currentAddress`, `financialDetails` | `{ message, data: { rider } }`  | "Rider profile created"   | "Missing required fields"   |
| Rider     | PUT    | `/rider/profile`          | FormData: `vehicleDetails`, `documents`, `currentAddress`...                  | `{ message, data: { rider } }`  | "Rider profile updated"   | "Rider not found"           |
| Rider     | GET    | `/rider/profile`          | None                                                                          | `{ message, data: { rider } }`  | "Rider profile fetched"   | "Rider not found"           |
| Rider     | PATCH  | `/rider/availability`     | `{ isAvailable: boolean }`                                                    | `{ message }`                   | "Availability updated"    | "Invalid payload"           |
| Rider     | PATCH  | `/rider/location`         | `{ lat, lon }`                                                                | `{ message }`                   | "Location updated"        | "Invalid coordinates"       |
| Rider     | GET    | `/rider/orders`           | None                                                                          | `{ message, data: [ orders ] }` | "Assigned orders fetched" | -                           |
| Rider     | PATCH  | `/rider/order/:id/status` | `{ orderStatus: 'pickedUp' \| 'outForDelivery' \| 'delivered' }`              | `{ message, data: { order } }`  | "Order status updated"    | "Invalid status transition" |

## 7. Admin (Required/Proposed)

| Component | Method | API Endpoint                   | Request Body                                      | Response Body                        | Success Message                    | Error Message          |
| :-------- | :----- | :----------------------------- | :------------------------------------------------ | :----------------------------------- | :--------------------------------- | :--------------------- |
| Admin     | GET    | `/admin/users`                 | Query: `?type`, `?status`                         | `{ message, data: [ users ] }`       | "Users fetched successfully"       | "Unauthorized Access"  |
| Admin     | GET    | `/admin/restaurants`           | Query: `?status`                                  | `{ message, data: [ restaurants ] }` | "Restaurants fetched successfully" | "Unauthorized Access"  |
| Admin     | PATCH  | `/admin/restaurant/:id/status` | `{ status: 'active' \| 'inactive' \| 'blocked' }` | `{ message }`                        | "Restaurant status updated"        | "Restaurant not found" |
| Admin     | GET    | `/admin/riders`                | Query: `?status`                                  | `{ message, data: [ riders ] }`      | "Riders fetched successfully"      | "Unauthorized Access"  |
| Admin     | PATCH  | `/admin/rider/:id/status`      | `{ status: 'active' \| 'inactive' \| 'blocked' }` | `{ message }`                        | "Rider status updated"             | "Rider not found"      |
| Admin     | GET    | `/admin/orders`                | Query: `?status`, `?date`                         | `{ message, data: [ orders ] }`      | "Orders fetched successfully"      | "Unauthorized Access"  |
