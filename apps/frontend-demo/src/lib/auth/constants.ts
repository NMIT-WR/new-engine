/**
 * Auth-related constants and configurations
 */

export const AUTH_ERRORS = {
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'No account found with this email',
  USER_EXISTS: 'An account with this email already exists',
  PASSWORD_REQUIRED: 'Please enter your password',
  PASSWORD_MISMATCH: 'Passwords do not match',
  TERMS_REQUIRED: 'You must accept the terms and conditions',
  GENERIC_ERROR: 'An error occurred. Please try again.',
} as const

export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: {
    title: 'Welcome back!',
    description: 'You have successfully signed in.',
  },
  REGISTER_SUCCESS: {
    title: 'Account created!',
    description: 'You have been automatically logged in.',
  },
  LOGOUT_SUCCESS: {
    title: 'Signed out',
    description: 'You have been successfully signed out.',
  },
} as const

export const AUTH_FORM_CONFIG = {
  EMAIL_PLACEHOLDER: 'you@example.com',
  EMAIL_HELP_TEXT: 'Use a valid email format (e.g., user@example.com)',
  PASSWORD_PLACEHOLDER: '••••••••',
  PASSWORD_HELP_TEXT:
    'At least 8 characters, including uppercase, lowercase and numbers',
} as const
