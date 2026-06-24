import { Request } from 'express';

// This matches the object you returned in your GoogleStrategy
export type GoogleUserType = {
  email: string;
  firstName: string;
  lastName: string;
  picture?: string;
  googleId: string;
  accessToken: string;
};

// Extend the Express Request to include your custom property
export interface RequestWithGoogleUser extends Request {
  googleUser: GoogleUserType;
}