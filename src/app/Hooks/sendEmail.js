import emailjs from "emailjs-com";

export const sendVerificationEmail = async (email, userName, code) => {
    const templateParams = {
        email: email,
        codigoVerificacion: `${code}`,
        userName: userName,
    };

    try {
        const response = await emailjs.send(
            "default_service",      // Reemplaza con tu SERVICE_ID
            "template_bufnet8",     // Reemplaza con tu TEMPLATE_ID
            templateParams,
            "qzSyYelML3OgYPDik"  // Reemplaza con tu PUBLIC_KEY en EmailJS
        );
        return response;
    } catch (error) {
        console.error("Error enviando el correo: ", error);
        throw error;
    }
};

