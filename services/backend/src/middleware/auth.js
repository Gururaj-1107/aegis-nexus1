const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Middleware to verify Google OAuth JWT tokens in the Authorization header.
 * Form: "Bearer <token>"
 */
async function verifyGoogleToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn('[Auth] Denied: Missing or malformed Bearer token');
      return res.status(401).json({ error: 'Unauthorized: Missing token' });
    }

    const token = authHeader.split(' ')[1];

    if (!process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID === 'your_google_oauth_client_id_here') {
      // In demo mode or if keys are not set, allow stub bypass for ease of use
      console.warn('[Auth] WARNING: Bypassing auth because GOOGLE_CLIENT_ID is not configured.');
      req.user = { name: "Demo Commander", email: "demo@aegisnexus.io" };
      return next();
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    
    // Inject user details into request for route handlers
    req.user = {
      googleId: payload['sub'],
      email: payload['email'],
      name: payload['name'],
      picture: payload['picture']
    };
    
    console.log(`[Auth] Verified user: ${req.user.email}`);
    next();
  } catch (error) {
    console.error('[Auth] JWT Verification failed:', error.message);
    res.status(403).json({ error: 'Forbidden: Invalid token' });
  }
}

module.exports = verifyGoogleToken;
