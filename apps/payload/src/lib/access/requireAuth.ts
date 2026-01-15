import type { Access } from 'payload'

export const requireAuth: Access = ({ req }) => Boolean(req.user)
