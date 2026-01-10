import { FormFieldRule, validate } from "../../../utils/validations.ts";
import { useEffect, useState } from "react";

interface FormFieldProps {
    title: string;
    value: string;
    placeholder: string;
    handleChangeText: (text: string) => void;
    otherStyles?: string;
    rules?: FormFieldRule[];
    onValidationChange?: (isValid: boolean, key: string) => void;
}

const FormField: React.FC<FormFieldProps> = ({
                                                 title,
                                                 rules,
                                                 value,
                                                 placeholder,
                                                 handleChangeText,
                                                 onValidationChange,
                                                 otherStyles = '',
                                                 ...props
                                             }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

    useEffect(() => {
        validateField(value);
    }, [rules]);

    const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        handleChangeText(text);
        validateField(text);
    };

    const validateField = (val: string) => {
        const error: string | undefined = validate(val, rules);
        if (onValidationChange) {
            onValidationChange(!error, title);
        }
        setErrorMessage(error);
    };

    const isPassword = title.toLowerCase().includes("пароль");

    return (
        <div className={`h-10 w-full my-5 ${otherStyles}`}>

            <div
                className={`w-full h-full px-4 bg-gray-100 rounded-xl border-2 ${
                    errorMessage ? "border-red-500" : "border-gray-300"
                } flex items-center`}
            >
                <input
                    className="flex-1 text-slate-500 font-psemibold text-base placeholder-gray-400 bg-transparent outline-none"
                    value={value}
                    placeholder={placeholder}
                    onChange={onTextChange}
                    type={isPassword && !showPassword ? "password" : "text"}
                    {...props}
                />

                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="ml-2"
                    >
                        {showPassword ? "🙈" : "👁️"}
                    </button>
                )}
            </div>

            {errorMessage && <p className="text-red-700 text-sm mt-1">{errorMessage}</p>}
        </div>
    );
};

export default FormField;
