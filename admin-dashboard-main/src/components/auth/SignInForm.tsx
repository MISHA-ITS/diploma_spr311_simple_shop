import {useState} from "react";
import { Link } from "react-router";
import {ChevronLeftIcon, EnvelopeIcon, EyeCloseIcon, EyeIcon} from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { useGoogleLogin } from "@react-oauth/google";
import { loginByGoogleApi } from "../../services/auth.ts";
import { useNavigate } from "react-router-dom";
import {useLoginMutation} from "../../services/apiAccount.ts";
import {ILoginRequest} from "../../models/account";
import { loginSuccess } from "../../store/authSlice.ts";
import {useDispatch} from "react-redux";
import {useAppSelector} from "../../store";

const initState: ILoginRequest = {
    email: "",
    password: "",
}

const SignInForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginRequest, { isLoading }] = useLoginMutation();

  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<string[]>([])

  const {user} = useAppSelector(globalState => globalState.auth);

  const [form, setForm] = useState<ILoginRequest>(initState);

  // --- Google login ---
  const loginByGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const googleToken = tokenResponse.access_token;
        const result = await loginByGoogleApi(googleToken);

        dispatch(loginSuccess(result.payload));
        navigate("/admin");
      } catch {
        setError("Помилка входу через Google");
      }
    },
    onError: () => setError("Помилка авторизації через Google"),
  });

  const validationChange = (isValid: boolean, fieldKey: string) => {
    if (isValid && errors.includes(fieldKey)) {
      setErrors(errors.filter(x => x !== fieldKey))
    } else if (!isValid && !errors.includes(fieldKey)) {
      setErrors(state => [...state, fieldKey])
    }
  };

  // --- Email/Password login ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
        const res = await loginRequest(form).unwrap();

        if (res.isSuccess) {
            dispatch(loginSuccess(res.payload));
            navigate("/admin");
        } else {
            setError(res.message);
        }
    } catch {
        setError("Помилка входу");
    }
  };

  return (
      <div className="flex flex-col flex-1">
          {user?.roles.includes("Admin") && (
              <div className="w-full max-w-md pt-10 mx-auto">
                  <Link
                      to="/admin"
                      className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                      <ChevronLeftIcon className="size-5" />
                      До панелі адміністратора
                  </Link>
              </div>
          )}


        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <div>
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                Вхід
              </h1>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-1 sm:gap-5">
              <button
                  onClick={() => loginByGoogle()}
                  className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
              >
                Продовжити через Google
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                      d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z"
                      fill="#4285F4"
                  />
                  <path
                      d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z"
                      fill="#34A853"
                  />
                  <path
                      d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z"
                      fill="#FBBC05"
                  />
                  <path
                      d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z"
                      fill="#EB4335"
                  />
                </svg>
              </button>
            </div>

            <div className="relative py-3 sm:py-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                  <span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">
                    Або
                  </span>
              </div>
            </div>

            {error && <p className="mb-2 text-sm text-red-500 dark:text-red-400">{error}</p>}

            <form onSubmit={handleLogin}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Електронна пошта <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                        placeholder="info@gmail.com"
                        value={form.email}
                        onChange={(e) => setForm({...form, email: e.target.value})}
                        className="pl-[62px]"
                        rules={[
                          {
                            rule: 'required',
                            message: "Пошта є обов'язкова",
                          },
                          {
                            rule: 'regexp',
                            value: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
                            message: "Пошта є некоректна",
                          },
                        ]}
                        onValidationChange={validationChange}
                    />
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                      <EnvelopeIcon className="size-6" />
                    </span>
                  </div>
                </div>

                <div>
                  <Label>
                    Пароль <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Введіть свій пароль"
                        value={form.password}
                        onChange={(e) => setForm({...form, password: e.target.value})}
                        onValidationChange={validationChange}
                        rules={[
                          {
                            rule: 'required',
                            message: 'Пароль є обов\'язковим'
                          },
                          {
                            rule: 'regexp',
                            value: '[0-9]',
                            message: 'Пароль має містити цифри'
                          },
                          {
                            rule: 'regexp',
                            value: '[!@#$%^&*(),.?":{}|<>]',
                            message: 'Пароль має містити спец символи '
                          },
                          {
                            rule: 'min',
                            value: 6,
                            message: 'Пароль має містити мін 6 символів'
                          },
                          {
                            rule: 'max',
                            value: 40,
                            message: 'Максимальна довжина паролю 40 символів'
                          }
                        ]}
                    />
                    <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                    {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                    Залишатися в системі
                  </span>
                  </div>
                  <Link
                      to="/forgot-password"
                      className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Забули пароль?
                  </Link>
                </div>

                <div>
                  <Button className="w-full" size="sm">
                    {isLoading ? "Завантаження..." : "Увійти"}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Немає облікового запису?{" "}
                <Link
                    to="/signup"
                    className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Зареєструватися
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default SignInForm;
