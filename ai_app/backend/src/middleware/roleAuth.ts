import { Request, Response, NextFunction } from 'express';
import { UserRole, AuthUser } from '@/types';

interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      });
      return;
    }

    next();
  };
};

export const requireSuperAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== 'super_admin') {
    res.status(403).json({
      success: false,
      error: 'Super admin access required'
    });
    return;
  }
  next();
};

export const requireAdminOrOwner = (
  ownerIdExtractor: (req: AuthenticatedRequest) => number | undefined
) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    // Super admin can access everything
    if (req.user.role === 'super_admin') {
      next();
      return;
    }

    // Admin can access most things
    if (req.user.role === 'admin') {
      next();
      return;
    }

    // Regular users can only access their own resources
    const ownerId = ownerIdExtractor(req);
    if (ownerId === undefined) {
      res.status(400).json({
        success: false,
        error: 'Unable to determine resource owner'
      });
      return;
    }

    if (req.user.id !== ownerId) {
      res.status(403).json({
        success: false,
        error: 'Access denied: You can only access your own resources'
      });
      return;
    }

    next();
  };
};