import crypto from "crypto";

function decodeBase64Key(base64) {
  return Buffer.from(base64, "base64").toString("utf8");
}

export function encryptPassword(password) {
  const publicKey = decodeBase64Key(process.env.PUBLIC_KEY);
  const encrypted = crypto.publicEncrypt(publicKey, Buffer.from(password, "utf8"));
  return encrypted.toString("base64");
}

export function decryptPassword(encryptedBase64) {
  const privateKey = {
    key: decodeBase64Key(process.env.PRIVATE_KEY),
    passphrase: process.env.PRIVATE_KEY_PASSPHRASE,
  };
  const decrypted = crypto.privateDecrypt(privateKey, Buffer.from(encryptedBase64, "base64"));
  return decrypted.toString("utf8");
}

export default function encryptOptions() {
  return [encryptPassword, decryptPassword];
}