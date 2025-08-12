const BACKEND = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "https://medusa-backend-qjok.onrender.com"

export const fixMedusaUrl = (u?: string) =>
    u ? u.replace(/^http:\/\/localhost:9000/i, BACKEND) : u