import { verifySession } from "@/lib/session";
import { LoginForm } from "@/components/admin/LoginForm";
import { EditorClient } from "@/components/admin/EditorClient";

export default async function AdminPage() {
    const isAuth = await verifySession();

    return (
        <main className="max-w-5xl mx-auto px-4 py-8">
            {!isAuth ? <LoginForm /> : <EditorClient />}
        </main>
    );
}
