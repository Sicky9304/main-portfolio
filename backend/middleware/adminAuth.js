/**
 * Admin Authentication Middleware
 * Validates request header token against configured ADMIN_PASSCODE.
 */
export default function adminAuth(req, res, next) {
  // Read passcode token from headers
  const token = req.headers['x-admin-token'] || req.headers['authorization']?.split(' ')[1];
  
  const serverPasscode = process.env.ADMIN_PASSCODE || 'sicky-secret-key-2026';
  
  if (!token || token !== serverPasscode) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid or missing admin token. Please configure the correct ADMIN_PASSCODE.',
    });
  }
  
  next();
}
