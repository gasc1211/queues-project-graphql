import * as jose from "jose";

// Get secret key from environment and encode it
const SECRET_KEY = new TextEncoder().encode(process.env.SECRET_KEY);

interface AuthToken {
  first_name: string;
  last_name: string;
  email: string;
  issued_at: string;
  is_verified: boolean;
}

export const authMiddleware = async (req, res, next) => {
  // Obtain authHeader from request object
  const authHeader = req.headers.authorization;

  if (authHeader) {
    // Separate token from scheme keyword
    const [scheme, token] = authHeader.split(' ');

    if (scheme && scheme.toLowerCase() === 'bearer' && token) {
      try {

        // Decode token using secret key
        const { payload, protectedHeader } = await jose.jwtVerify(token, SECRET_KEY);
        const { email, issued_at: expires, is_verified, first_name, last_name } = payload as unknown as AuthToken;

        // Verify token fields integrity
        if (!email || !expires || is_verified === undefined || !first_name || !last_name) {
          return res.status(400).json({ error: 'Non valid token: missing fields...' });
        }

        // Verify token expiration
        const now = Date.now();
        const expires_on = new Date(expires).getTime();

        if (expires_on > now)
          return res.status(401).json({ error: 'Expired auth token...' });

        // Verify user verification staus
        if (!is_verified)
          return res.status(403).json({ error: 'Non verified user...' });

        // Inject payload into request user object
        req.user = {
          email,
          first_name,
          last_name,
          is_verified,
        };

        next();
      } catch (err) {
        console.error('Error during token verification:', err);
        return res.status(401).json({ error: 'Non valid or expired token...' });
      }
    } else {
      // Badly formatted authorization header
      return res.status(400).json({ error: 'Auth token format not valid...' });
    }
  } else {
    // No authorization header found on request
    return res.status(401).json({ error: 'Authentication is required...' });
  }
};