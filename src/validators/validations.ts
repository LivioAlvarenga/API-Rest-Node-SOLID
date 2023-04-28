import { z } from 'zod'

// To register a user, we can use a more specific message for each field
export const registerBodySchema = z.object({
  name: z
    .string()
    .min(1)
    .max(255)
    .trim()
    .toLowerCase()
    .regex(/^[a-zA-ZÀ-ú .,!?-_@']+$/g, {
      message:
        'Name must have only letters, spaces and some special characters',
    }),
  email: z
    .string()
    .min(5)
    .max(255)
    .trim()
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/g, {
      message: 'Invalid email address.',
    }),
  password: z
    .string()
    .min(8)
    .max(128)
    .trim()
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?]).+$/g,
      {
        message:
          'Password must have at least one uppercase letter, one lowercase letter, one number and one special character',
      },
    ),
})

// To authenticate a user, we must use a message 'Invalid credentials' for both email and password to avoid giving a clue to the attacker
export const authenticateBodySchema = z.object({
  email: z
    .string()
    .min(5)
    .max(255)
    .trim()
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/g, {
      message: 'Invalid credentials',
    }),
  password: z
    .string()
    .min(8)
    .max(128)
    .trim()
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?]).+$/g,
      {
        message: 'Invalid credentials',
      },
    ),
})
