import { NextRequest } from 'next/server'

export const ADMIN_COOKIE = 'elyvate_admin_session'

export function isAdminAuthed(req: NextRequest): boolean {
  const cookie = req.cookies.get(ADMIN_COOKIE)?.value
  const expected = process.env.ADMIN_SECRET
  return !!expected && cookie === expected
}
