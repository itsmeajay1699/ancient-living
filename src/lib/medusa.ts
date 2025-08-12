import Medusa from "@medusajs/medusa-js"
import MedusaSDK from "@medusajs/js-sdk"

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
const MEDUSA_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_API_KEY || "pk_d53866c7eb83b9c69b1a821ba241079d49c0d7d7d9ed60438019e18bc3c9d1df"

// Legacy Medusa client for backward compatibility
export const medusaLegacy = new Medusa({
    baseUrl: MEDUSA_BACKEND_URL,
    maxRetries: 3,
    publishableApiKey: MEDUSA_API_KEY,
})

// New Medusa JS SDK (v2) - try different import syntax
export const sdk = new MedusaSDK({
    baseUrl: MEDUSA_BACKEND_URL,
    publishableKey: MEDUSA_API_KEY,
})

// Export both for compatibility
export const medusa = medusaLegacy

// Debug function to test connection
export const testMedusaConnection = async () => {
    try {
        console.log('Testing Medusa connection...')
        console.log('Backend URL:', MEDUSA_BACKEND_URL)
        console.log('API Key:', MEDUSA_API_KEY)

        // Test a simple API call
        const response = await fetch(`${MEDUSA_BACKEND_URL}/store/regions`, {
            headers: {
                'x-publishable-api-key': MEDUSA_API_KEY,
                'Content-Type': 'application/json'
            }
        })

        console.log('Connection test response:', response.status)
        return response.ok
    } catch (error) {
        console.error('Medusa connection test failed:', error)
        return false
    }
}