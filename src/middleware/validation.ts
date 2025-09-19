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

// validation middleware for create post
export const validateCreatePost = (req: Request, res: Response, next: NextFunction): void => {
  const { userId, content } = req.body;

  // Check required fields
  if (!userId) {
    res.status(400).json({
      status: 400,
      message: "User ID is required"
    });
    return;
  }

  if (!content) {
    res.status(400).json({
      status: 400,
      message: "Content is required"
    });
    return;
  }

  // Validate content length
  if (content.trim().length < 1) {
    res.status(400).json({
      status: 400,
      message: "Content cannot be empty"
    });
    return;
  }

  if (content.length > 2000) {
    res.status(400).json({
      status: 400,
      message: "Content must be less than 2000 characters"
    });
    return;
  }

  // Validate userId format (should be UUID)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(userId)) {
    res.status(400).json({
      status: 400,
      message: "Invalid user ID format"
    });
    return;
  }

  next();
};

// validation middleware for create comment
export const validateCreateComment = (req: Request, res: Response, next: NextFunction): void => {
  const { userId, postId, content } = req.body;

  // Check required fields
  if (!userId) {
    res.status(400).json({
      status: 400,
      message: "User ID is required"
    });
    return;
  }

  if (!postId) {
    res.status(400).json({
      status: 400,
      message: "Post ID is required"
    });
    return;
  }

  if (!content) {
    res.status(400).json({
      status: 400,
      message: "Content is required"
    });
    return;
  }

  // Validate content length
  if (content.trim().length < 1) {
    res.status(400).json({
      status: 400,
      message: "Content cannot be empty"
    });
    return;
  }

  if (content.length > 2000) {
    res.status(400).json({
      status: 400,
      message: "Content must be less than 2000 characters"
    });
    return;
  }

  // Validate userId format (should be UUID)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(userId)) {
    res.status(400).json({
      status: 400,
      message: "Invalid user ID format"
    });
    return;
  }

  if (!uuidRegex.test(postId)) {
    res.status(400).json({
      status: 400,
      message: "Invalid post ID format"
    });
    return;
  }

  next();
};

// validation middleware create like
export const validateCreateLike = (req: Request, res: Response, next: NextFunction): void => {
  const { userId, postId } = req.body;

  // Check if required fields are present
  if (!userId || !postId) {
      res.status(400).json({
          status: 400,
          message: "userId and postId are required",
          data: {}
      });
      return;
  }

  // Check if they are valid strings (you might want to add UUID validation)
  if (typeof userId !== 'string' || typeof postId !== 'string') {
      res.status(400).json({
          status: 400,
          message: "userId and postId must be valid strings",
          data: {}
      });
      return;
  }

  // Check if they are not empty strings
  if (userId.trim() === '' || postId.trim() === '') {
      res.status(400).json({
          status: 400,
          message: "userId and postId cannot be empty",
          data: {}
      });
      return;
  }

  next();
};

// validation middleware unlike
export const validateUnlikePost = (req: Request, res: Response, next: NextFunction): void => {
  const { userId, postId } = req.body;

  // Same validation as createLike
  if (!userId || !postId) {
      res.status(400).json({
          status: 400,
          message: "userId and postId are required",
          data: {}
      });
      return;
  }

  if (typeof userId !== 'string' || typeof postId !== 'string') {
      res.status(400).json({
          status: 400,
          message: "userId and postId must be valid strings",
          data: {}
      });
      return;
  }

  if (userId.trim() === '' || postId.trim() === '') {
      res.status(400).json({
          status: 400,
          message: "userId and postId cannot be empty",
          data: {}
      });
      return;
  }

  next();
};

// Optional: UUID validation if you're using UUIDs
export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// validation middleware uuid
export const validateUUIDs = (req: Request, res: Response, next: NextFunction): void => {
  const { userId, postId } = req.body;

  if (userId && !isValidUUID(userId)) {
      res.status(400).json({
          status: 400,
          message: "Invalid userId format",
          data: {}
      });
      return;
  }

  if (postId && !isValidUUID(postId)) {
      res.status(400).json({
          status: 400,
          message: "Invalid postId format",
          data: {}
      });
      return;
  }

  next();
};

// validation middleware create save
export const validateCreateSave = (req: Request, res: Response, next: NextFunction): void => {
  const { userId, postId } = req.body;

  // Check if required fields are present
  if (!userId || !postId) {
      res.status(400).json({
          status: 400,
          message: "userId and postId are required",
          data: {}
      });
      return;
  }

  // Check if they are valid strings (you might want to add UUID validation)
  if (typeof userId !== 'string' || typeof postId !== 'string') {
      res.status(400).json({
          status: 400,
          message: "userId and postId must be valid strings",
          data: {}
      });
      return;
  }

  // Check if they are not empty strings
  if (userId.trim() === '' || postId.trim() === '') {
      res.status(400).json({
          status: 400,
          message: "userId and postId cannot be empty",
          data: {}
      });
      return;
  }

  next();
};

// validation middleware unsave
export const validateUnSavePost = (req: Request, res: Response, next: NextFunction): void => {
  const { userId, postId } = req.body;

  // Same validation as createLike
  if (!userId || !postId) {
      res.status(400).json({
          status: 400,
          message: "userId and postId are required",
          data: {}
      });
      return;
  }

  if (typeof userId !== 'string' || typeof postId !== 'string') {
      res.status(400).json({
          status: 400,
          message: "userId and postId must be valid strings",
          data: {}
      });
      return;
  }

  if (userId.trim() === '' || postId.trim() === '') {
      res.status(400).json({
          status: 400,
          message: "userId and postId cannot be empty",
          data: {}
      });
      return;
  }

  next();
};

// validation middleware for follow user
export const validateFollowUser = (req: Request, res: Response, next: NextFunction): void => {
  const { followerId, followingId } = req.body;

  // Check if required fields are present
  if (!followerId || !followingId) {
      res.status(400).json({
          status: 400,
          message: "followerId and followingId are required",
          data: {}
      });
      return;
  }

  // Check if they are valid strings
  if (typeof followerId !== 'string' || typeof followingId !== 'string') {
      res.status(400).json({
          status: 400,
          message: "followerId and followingId must be valid strings",
          data: {}
      });
      return;
  }

  // Check if they are not empty strings
  if (followerId.trim() === '' || followingId.trim() === '') {
      res.status(400).json({
          status: 400,
          message: "followerId and followingId cannot be empty",
          data: {}
      });
      return;
  }

  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(followerId)) {
      res.status(400).json({
          status: 400,
          message: "Invalid followerId format",
          data: {}
      });
      return;
  }

  if (!uuidRegex.test(followingId)) {
      res.status(400).json({
          status: 400,
          message: "Invalid followingId format",
          data: {}
      });
      return;
  }

  next();
};

// validation middleware for unfollow user
export const validateUnfollowUser = (req: Request, res: Response, next: NextFunction): void => {
  const { followerId, followingId } = req.body;

  // Same validation as followUser
  if (!followerId || !followingId) {
      res.status(400).json({
          status: 400,
          message: "followerId and followingId are required",
          data: {}
      });
      return;
  }

  if (typeof followerId !== 'string' || typeof followingId !== 'string') {
      res.status(400).json({
          status: 400,
          message: "followerId and followingId must be valid strings",
          data: {}
      });
      return;
  }

  if (followerId.trim() === '' || followingId.trim() === '') {
      res.status(400).json({
          status: 400,
          message: "followerId and followingId cannot be empty",
          data: {}
      });
      return;
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(followerId)) {
      res.status(400).json({
          status: 400,
          message: "Invalid followerId format",
          data: {}
      });
      return;
  }

  if (!uuidRegex.test(followingId)) {
      res.status(400).json({
          status: 400,
          message: "Invalid followingId format",
          data: {}
      });
      return;
  }

  next();
};