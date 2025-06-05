import emailjs from "emailjs-com";

// utils/sendVerificationEmail.js o similar

export const sendVerificationEmail = async (email, userName, code) => {
  const response = await fetch("/api/userEmail", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, userName, code }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Error al enviar correo");
  }

  return result;
};
