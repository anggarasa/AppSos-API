import { Request, Response, NextFunction } from 'express';

// Validation middleware for user creation
export const validateCreateUser = (req: Request, res: Response, next: NextFunction): void => {
  const { name, username, email, password } = req.body;

  if (!name || !username || !email || !password) {
    res.status(400).json({
      message: "All fields (name, username, email, password) are required"
    });
    return; // tambahin return biar jelas berhenti di sini
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({
      message: "Invalid email format"
    });
    return;
  }

  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  if (!usernameRegex.test(username)) {
    res.status(400).json({
      message: "Username must be 3-20 characters long and contain only letters, numbers, and underscores"
    });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({
      message: "Password must be at least 6 characters long"
    });
    return;
  }

  if (name.trim().length < 2 || name.trim().length > 50) {
    res.status(400).json({
      message: "Name must be between 2 and 50 characters long"
    });
    return;
  }

  next();
};


// Validation middleware for user update
export const validateUpdateUser = (req: Request, res: Response, next: NextFunction): void => {
  const { name, username, email, bio, avatarUrl } = req.body;
  const hasAvatarFile = Boolean((req as any).file);

  if (!name && !username && !email && !bio && !avatarUrl && !hasAvatarFile) {
    res.status(400).json({
      message: "At least one field (or avatar file) must be provided for update"
    });
    return;
  }

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        message: "Invalid email format"
      });
      return;
    }
  }

  if (username) {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      res.status(400).json({
        message: "Username must be 3-20 characters long and contain only letters, numbers, and underscores"
      });
      return;
    }
  }

  if (name) {
    if (name.trim().length < 2 || name.trim().length > 50) {
      res.status(400).json({
        message: "Name must be between 2 and 50 characters long"
      });
      return;
    }
  }

  if (bio && bio.length > 500) {
    res.status(400).json({
      message: "Bio must be less than 500 characters"
    });
    return;
  }

  if (avatarUrl) {
    try {
      new URL(avatarUrl);
    } catch {
      res.status(400).json({
        message: "Invalid avatar URL format"
      });
      return;
    }
  }

  next();
};

// Validation middleware for login
export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({
      status:400,
      message: "Username and password are required"
    });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({
      status: 400,
      message: "Password must be at least 6 characters long"
    });
    return;
  }

  next();
};