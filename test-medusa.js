// Test script to verify Medusa API key configuration
const { createRequire } = require('module');
const require = createRequire(import.meta.url);

console.log('Testing Medusa configuration...');
console.log('API Key:', process.env.NEXT_PUBLIC_MEDUSA_API_KEY);
console.log('Backend URL:', process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL);

// Test basic connection
fetch('http://localhost:9000/store/auth', {
    method: 'OPTIONS',
    headers: {
        'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_API_KEY || 'pk_d53866c7eb83b9c69b1a821ba241079d49c0d7d7d9ed60438019e18bc3c9d1df',
        'Content-Type': 'application/json'
    }
})
    .then(response => {
        console.log('Response status:', response.status);
        return response.text();
    })
    .then(data => {
        console.log('Response:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
