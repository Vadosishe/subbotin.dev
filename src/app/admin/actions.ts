"use server";

import { createSession } from "@/lib/session";

export async function loginAction(password: string) {
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
        return { error: "ADMIN_PASSWORD is not set on the server" };
    }

    if (password !== adminPassword) {
        return { error: "Неверный пароль" };
    }

    await createSession();
    return { success: true };
}
