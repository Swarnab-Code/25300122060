import crypto from "crypto"

function generateShortCode(length = 6) {
  return crypto.randomBytes(length).toString("base64url").slice(0, length);
}

export default generateShortCode;
