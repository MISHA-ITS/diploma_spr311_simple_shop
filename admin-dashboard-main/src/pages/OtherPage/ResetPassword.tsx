import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import EnvConfig from "../../config/env.ts";

const ResetPasswordPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const email = searchParams.get("email") || "";
    const token = searchParams.get("token") || "";

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
        setMessage("");

        try {
            const res = await fetch(`${EnvConfig.API_URL}/api/account/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, token, newPassword }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Не вдалося скинути пароль");
            } else {
                setMessage("Пароль успішно змінено");
                setTimeout(() => navigate("/signin"), 2000);
            }
        } catch {
            setError("Помилка сервера");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col px-6">

            {/* Back link */}
            <div className="pt-6">
                <Link
                    to="/signin"
                    className="text-sm text-gray-600 hover:text-black flex items-center gap-2"
                >
                    ← Повернутись до входу
                </Link>
            </div>

            {/* Center content */}
            <div className="flex flex-1 items-center justify-center">
                <div className="w-full max-w-md text-center">

                    <h1 className="text-3xl font-semibold mb-3">
                        Створити новий пароль
                    </h1>

                    <p className="text-gray-500 text-sm mb-10">
                        Ваш новий пароль має відрізнятися від пароля, який використовувався раніше
                    </p>

                    {message && (
                        <p className="text-green-600 mb-4">{message}</p>
                    )}

                    {error && (
                        <p className="text-red-600 mb-4">{error}</p>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-10">

                        {/* New password */}
                        <div className="text-left relative">
                            <label className="text-sm text-gray-500">
                                Новий пароль
                            </label>
                            <input
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className="
                                    w-full
                                    border-0
                                    border-b
                                    border-gray-400
                                    bg-transparent
                                    py-2
                                    pr-8
                                    focus:outline-none
                                    focus:border-black
                                "
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-0 top-9 text-gray-500"
                            >
                                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {/* Confirm password */}
                        <div className="text-left relative">
                            <label className="text-sm text-gray-500">
                                Підтвердіть пароль
                            </label>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="
                                    w-full
                                    border-0
                                    border-b
                                    border-gray-400
                                    bg-transparent
                                    py-2
                                    pr-8
                                    focus:outline-none
                                    focus:border-black
                                "
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-0 top-9 text-gray-500"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {/* Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                w-60
                                mx-auto
                                py-3
                                rounded-lg
                                bg-gray-300
                                text-gray-700
                                font-medium
                                transition
                                hover:bg-gray-400
                                disabled:opacity-60
                            "
                        >
                            {loading ? "Збереження..." : "Зберегти"}
                        </button>

                    </form>

                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;