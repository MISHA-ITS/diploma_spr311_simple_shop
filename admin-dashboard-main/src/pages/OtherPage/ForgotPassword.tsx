import { useState } from "react";
import EnvConfig from "../../config/env.ts";

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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
                setMessage(data.message || "Лист надіслано, перевірте пошту");
            }
        } catch (err) {
            setError("Помилка сервера");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-4">
            <h2 className="text-xl font-bold mb-4">Відновлення пароля</h2>
            {message && <p className="text-green-600 mb-4">{message}</p>}
            {error && <p className="text-red-600 mb-4">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Введіть ваш email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-2 border rounded mb-4"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-500 text-white p-2 rounded"
                >
                    {loading ? "Надсилаю..." : "Надіслати лист"}
                </button>
            </form>
        </div>
    );
};

export default ForgotPasswordPage;