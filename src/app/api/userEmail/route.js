import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

// Solo POST
export async function POST(request) {
    try {
        const body = await request.json();
        const { email, userName, code } = body;

        console.log(body);
        // Verificar si ya existe ese correo
        const existe = await prisma.user.findUnique({
            where: { email: email },
        });

        console.log(existe)
        if (existe) {
            return NextResponse.json(
                { error: "El correo ya está registrado" },
                { status: 400 }
            );
        }

        // Datos para EmailJS
        const templateParams = {
            email,
            codigoVerificacion: `${code}`,
            userName,
        };

        // Llamada a EmailJS REST API
        const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                origin: "http://localhost", // puede ser cualquiera
            },
            body: JSON.stringify({
                service_id: "default_service",
                template_id: "template_bufnet8",
                user_id: "qzSyYelML3OgYPDik",
                template_params: templateParams,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("EmailJS error:", errorText);
            return NextResponse.json(
                { error: "Error al enviar el correo" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Correo enviado correctamente" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error general:", error);
        return NextResponse.json(
            { error: "Ocurrió un error al procesar la solicitud" },
            { status: 500 }
        );
    }
}
