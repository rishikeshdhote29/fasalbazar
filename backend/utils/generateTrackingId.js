const crypto = require('crypto');

/**
 * Generates a 15-digit unique order ID
 * @returns {string} 15-digit order ID as a string
 */
function generateTrackingId() {
    // Generate 8 random bytes (64 bits) securely
    const buffer = crypto.randomBytes(8);

    // Convert to a big integer and ensure it's 15 digits
    const num = BigInt('0x' + buffer.toString('hex')) % BigInt(10 ** 15);

    // Pad with leading zeros if necessary to ensure 15 digits
    return num.toString().padStart(15, '0');
}
module.exports=generateTrackingId;