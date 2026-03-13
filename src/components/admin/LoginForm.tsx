"use client";

import { useState } from "react";
import { loginAction } from "@/app/admin/actions";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export function LoginForm() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await loginAction(password);
            if (res.error) {
                setError(res.error);
            } else {
                router.refresh(); // Refresh the page to load the editor
            }
        } catch (err) {
            setError("Произошла ошибка при входе");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[50vh] items-center justify-center">
            <div className="w-full max-w-sm p-8 rounded-2xl border border-current/10 shadow-2xl" style={{ backgroundColor: 'var(--card-bg)' }}>
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-4">
                        <Lock className="w-6 h-6 text-indigo-400" />
                    </div>
                    <h1 className="text-xl font-bold text-current opacity-90">Вход в Админку</h1>
                    <p className="text-sm opacity-60 mt-2 text-center">
                        Введите пароль для доступа к редактору блога
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Пароль"
                            className="w-full px-4 py-3 rounded-xl bg-current/5 border border-current/10 text-current placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-400 text-center">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Вход..." : "Войти"}
                    </button>
                </form>
            </div>
        </div>
    );
}
