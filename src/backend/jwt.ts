import jwt from 'jsonwebtoken'; //avoids interop issues with commonJS
import type { JwtPayload } from 'jsonwebtoken';//only want the shape, not the value
import type { Request, Response, NextFunction } from 'express';

//payloads always include iat and exp, this one also includes a userId
export interface UserPayload extends JwtPayload {
  userId: string;
}

//read secret only when i actually need it
function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT secret is not defined');
  }
  return secret;
}

function createToken(userId: string): string {
  return jwt.sign({ userId }, getSecret(), { expiresIn: '1h' }); //payload, signing key, exp
}

function verifyToken(token: string): UserPayload | undefined {
  try {
    //validate signature and expiration
    return jwt.verify(token, getSecret()) as UserPayload;
  } catch {
    return undefined;
  }
}

function authenticateToken(req: Request, res: Response, next: NextFunction) {
  
  const authHeader = req.headers.authorization;
  //checks format, extracts token, and verifies it
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : undefined;

  //if no token not verified
  if (!token) return res.sendStatus(401);

  const decoded = verifyToken(token);
  //if token exists but it is invalid
  if (!decoded) return res.sendStatus(403);

  //identity to request
  req.userId = decoded.userId;
  next();
}

//one export
export default {
  createToken,
  verifyToken,
  authenticateToken,
};
