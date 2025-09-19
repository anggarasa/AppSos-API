import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your_refresh_jwt_secret';

// Token payload interface
export interface TokenPayload {
  userId: string;
  username: string;
  type: 'access' | 'refresh';
}

// Generate access token (short-lived, 15 minutes)
export const generateAccessToken = (userId: string, username: string): string => {
  const payload: TokenPayload = {
    userId,
    username,
    type: 'access'
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '15m'
  });
};

// Generate refresh token (long-lived, 7 days)
export const generateRefreshToken = (userId: string, username: string): string => {
  const payload: TokenPayload = {
    userId,
    username,
    type: 'refresh'
  };

  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: '7d'
  });
};

// Verify access token
export const verifyAccessToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    
    if (decoded.type !== 'access') {
      return null;
    }
    
    return decoded;
  } catch (error) {
    return null;
  }
};

// Verify refresh token
export const verifyRefreshToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
    
    if (decoded.type !== 'refresh') {
      return null;
    }
    
    return decoded;
  } catch (error) {
    return null;
  }
};

// Generate both tokens
export const generateTokenPair = (userId: string, username: string) => {
  const accessToken = generateAccessToken(userId, username);
  const refreshToken = generateRefreshToken(userId, username);

  return {
    accessToken,
    refreshToken
  };
};

// Extract token from Authorization header
export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
};
