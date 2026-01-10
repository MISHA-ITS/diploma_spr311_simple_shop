import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import EnvConfig from "../../config/env.ts";

const ResetPasswordPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const email = searchParams.get("email") || "";
    const token = searchParams.get("token") || "";

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError("Паролі не співпадають");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`${EnvConfig.API_URL}/api/account/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, token, newPassword }),
            });
            const data = await res.json();
            if (res.ok) {
                setMessage("Пароль успішно змінено");
                setTimeout(() => navigate("/signin"), 2000);
            } else {
                setError(data.message || "Не вдалося скинути пароль");
            }
        } catch {
            setError("Помилка сервера");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-4">
            <h2 className="text-xl font-bold mb-4">Скинути пароль</h2>
            {message && <p className="text-green-600 mb-4">{message}</p>}
            {error && <p className="text-red-600 mb-4">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="Новий пароль"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full p-2 border rounded mb-4"
                />
                <input
                    type="password"
                    placeholder="Підтвердіть пароль"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full p-2 border rounded mb-4"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-500 text-white p-2 rounded"
                >
                    {loading ? "Завантаження..." : "Скинути пароль"}
                </button>
            </form>
        </div>
    );
};

export default ResetPasswordPage;