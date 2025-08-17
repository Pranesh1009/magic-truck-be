# Authentication Middleware Documentation

## Overview

The authentication middleware provides JWT token verification and user authentication for protected routes in the MagicTruck API.

## Features

- **JWT Token Verification**: Validates JWT tokens from the Authorization header
- **User Validation**: Ensures the user still exists in the database
- **Role-based Authorization**: Optional middleware for role-based access control
- **Comprehensive Logging**: Detailed logging for security monitoring
- **Error Handling**: Proper error responses for various authentication scenarios

## Usage

### Basic Authentication

To protect a route with authentication, import and use the `authenticateToken` middleware:

```typescript
import { authenticateToken } from "../middlewares/auth.middleware";

// Protect a single route
router.get("/protected", authenticateToken, (req, res) => {
  // Access user information from req.user
  const userId = req.user?.id;
  const userEmail = req.user?.email;
  const userRole = req.user?.roleId;

  res.json({ message: "Protected route accessed", user: req.user });
});

// Protect all routes in a router
router.use(authenticateToken);
```

### Role-based Authorization

#### Require Specific Role

```typescript
import { authenticateToken, requireRole } from "../middlewares/auth.middleware";

// Only users with roleId "admin" can access this route
router.get(
  "/admin-only",
  authenticateToken,
  requireRole("admin"),
  (req, res) => {
    res.json({ message: "Admin route accessed" });
  }
);
```

#### Require Any of Multiple Roles

```typescript
import {
  authenticateToken,
  requireAnyRole,
} from "../middlewares/auth.middleware";

// Users with roleId "admin" OR "manager" can access this route
router.get(
  "/management",
  authenticateToken,
  requireAnyRole(["admin", "manager"]),
  (req, res) => {
    res.json({ message: "Management route accessed" });
  }
);
```

## Request Object Extension

The middleware extends the Express Request object to include user information:

```typescript
interface Request {
  user?: {
    id: string;
    email: string;
    roleId?: string;
  };
}
```

## Error Responses

The middleware returns appropriate HTTP status codes and error messages:

- **401 Unauthorized**: No token provided, invalid token, token expired, or user not found
- **403 Forbidden**: Insufficient role permissions
- **500 Internal Server Error**: Server configuration issues

## Environment Variables

Make sure the following environment variable is set:

```env
JWT_SECRET=your-secret-key-here
```

## Security Features

1. **Token Validation**: Verifies JWT signature and expiration
2. **User Existence Check**: Ensures the user still exists in the database
3. **Account Status Check**: Validates if the user account is active
4. **Comprehensive Logging**: Logs all authentication attempts for security monitoring
5. **Error Handling**: Proper error responses without exposing sensitive information

## Example Implementation

Here's a complete example of how to use the middleware in a route file:

```typescript
import { Router } from "express";
import {
  authenticateToken,
  requireRole,
  requireAnyRole,
} from "../middlewares/auth.middleware";
import { someController } from "../controllers/some.controller";

const router = Router();

// Public routes (no authentication required)
router.get("/public", someController.publicMethod);

// Protected routes (authentication required)
router.get("/profile", authenticateToken, someController.getProfile);
router.put("/profile", authenticateToken, someController.updateProfile);

// Role-specific routes
router.get(
  "/admin/dashboard",
  authenticateToken,
  requireRole("admin"),
  someController.adminDashboard
);

router.get(
  "/management/reports",
  authenticateToken,
  requireAnyRole(["admin", "manager"]),
  someController.managementReports
);

export default router;
```

## Testing

To test protected endpoints, include the JWT token in the Authorization header:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3000/api/protected-route
```

## Best Practices

1. **Always use HTTPS** in production to protect tokens in transit
2. **Set appropriate token expiration** times (default: 24h)
3. **Implement token refresh** for long-lived sessions
4. **Monitor authentication logs** for security threats
5. **Use role-based access control** for fine-grained permissions
6. **Regularly rotate JWT secrets** for enhanced security
