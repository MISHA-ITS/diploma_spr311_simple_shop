import { useState } from "react";
import EnvConfig from "../../config/env.ts";
import {Link} from "react-router-dom";
import {useNavigate} from "react-router";

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const res = await fetch(`${EnvConfig.API_URL}/api/account/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Помилка відправки листа");
            } else {
                navigate("/signin");
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
                        Забули пароль?
                    </h1>

                    <p className="text-gray-500 text-sm mb-10">
                        Будь ласка, введіть свою адресу електронної пошти, щоб отримати код підтвердження
                    </p>

                    {message && (
                        <p className="text-green-600 mb-4">{message}</p>
                    )}

                    {error && (
                        <p className="text-red-600 mb-4">{error}</p>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-10">

                        {/* Input with underline */}
                        <div className="text-left">
                            <label className="text-sm text-gray-500">
                                Емейл
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="
                                  w-full
                                  border-0
                                  border-b
                                  border-gray-400
                                  bg-transparent
                                  py-2
                                  focus:outline-none
                                  focus:border-black
                                "
                            />
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
                            {loading ? "Надсилаю..." : "Відправити"}
                        </button>

                    </form>

                    {/* Try another way */}
                    <div className="mt-8">
                        <button className="text-sm underline text-gray-600 hover:text-black">
                            Спробувати інший спосіб
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;