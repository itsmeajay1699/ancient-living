import Medusa from "@medusajs/medusa-js"

export const medusa = new Medusa({
    baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000",
    maxRetries: 3,
    publishableApiKey: process.env.NEXT_PUBLIC_MEDUSA_API_KEY || "your-key-here",


})