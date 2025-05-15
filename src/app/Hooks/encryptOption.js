import fs from "fs";
import crypto from "crypto";

const publicKey = fs.readFileSync("public.pem", "utf8");

export function encryptPassword(password) {
  const encrypted = crypto.publicEncrypt(publicKey, Buffer.from(password, "utf8"));
  return encrypted.toString("base64");
}

const privateKey = {
  key: fs.readFileSync("private_key.pem", "utf8"),
  passphrase: process.env.PRIVATE_KEY_PASSPHRASE // o usa un prompt seguro si es interactivo
};

export function decryptPassword(encryptedBase64) {
  const encrypted = Buffer.from(encryptedBase64, "base64");
  
  const decrypted = crypto.privateDecrypt(privateKey, encrypted);
  return decrypted.toString("utf8");
}
export default function encryptOptions() {
  return [encryptPassword, decryptPassword];
}