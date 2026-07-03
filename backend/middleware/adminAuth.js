/**
 * Admin Authentication Middleware
 * Validates request header token against configured ADMIN_PASSCODE.
 */
export default function adminAuth(req, res, next) {
  // Read admin token from request headers
  const token =
    req.headers["x-admin-token"] ||
    req.headers.authorization?.split(" ")[1];

  // Read passcode from .env
  const serverPasscode = process.env.ADMIN_PASSCODE;

  // Check if passcode is configured
  if (!serverPasscode) {
    return res.status(500).json({
      success: false,
      message: "Admin passcode is not configured.",
    });
  }

  // Validate token
  if (!token || token !== serverPasscode) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  next();
}