import { useEffect, useState } from "react";
import { IUserProfile } from "../types/Account/IUserProfile";
import { IUserUpdate } from "./Users/types";
import EnvConfig from "../config/env";
import {useDeleteProfileMutation, useUpdateProfileMutation} from "../services/apiAccount.ts";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Props {
    user: IUserProfile;
}

const confirmDeleteToast = (onConfirm: () => void) => {
    toast(
        ({ closeToast }) => (
            <div className="flex flex-col gap-3">
                <p className="font-medium">
                    Ви впевнені що хочете видалити профіль?
                </p>

                <div className="flex gap-2 justify-end">
                    <button
                        className="px-3 py-1 bg-gray-200 rounded"
                        onClick={closeToast}
                    >
                        Скасувати
                    </button>

                    <button
                        className="px-3 py-1 bg-red-600 text-white rounded"
                        onClick={() => {
                            closeToast?.();
                            onConfirm();
                        }}
                    >
                        Видалити
                    </button>
                </div>
            </div>
        ),
        {
            autoClose: false,
            closeOnClick: false
        }
    );
};

const ProfileSection = ({ user }: Props) => {
    const [isEditing, setIsEditing] = useState(false);
    const [updateUser, { isLoading }] = useUpdateProfileMutation();
    const [deleteProfile] = useDeleteProfileMutation();

    const [formState, setFormState] = useState<IUserUpdate>({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        roles: user.roles ?? [],
        imageFile: null,
    });

    const [preview, setPreview] = useState<string | null>(
        user.image
            ? `${EnvConfig.API_URL}/images/users/200_${user.image}`
            : null
    );

    // Очищення object URL щоб не було memory leak
    useEffect(() => {
        return () => {
            if (preview && preview.startsWith("blob:")) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const handleChange = (
        field: keyof IUserUpdate,
        value: string | string[] | File | null
    ) => {
        setFormState(prev => ({ ...prev, [field]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const objectUrl = URL.createObjectURL(file);

        setFormState(prev => ({
            ...prev,
            imageFile: file,
        }));

        setPreview(objectUrl);
    };

    const handleSave = async () => {
        try {
            await updateUser({
                id: user.id,
                email: formState.email,
                firstName: formState.firstName,
                lastName: formState.lastName,
                phoneNumber: formState.phoneNumber ?? "",
                roles: formState.roles,
                imageFile: formState.imageFile
            }).unwrap();

            setIsEditing(false);
        } catch (error) {
            console.error("Update error:", error);
        }
    };

    const formatDate = (dateString: string) => {
        const [datePart] = dateString.split(" ");
        const [day, month, year] = datePart.split(".");
        return new Date(`${year}-${month}-${day}`).toLocaleDateString("uk-UA");
    };

    const handleDeleteProfile = () => {

        confirmDeleteToast(async () => {
            try {
                await deleteProfile().unwrap();

                toast.success("Профіль видалено");

                localStorage.removeItem("token");

                window.location.href = "/";
            } catch (error) {
                console.error(error);
                toast.error("Помилка видалення профілю");
            }
        });

    };

    return (
        <div className="max-w-md mx-auto border rounded-xl p-8 shadow-sm bg-white min-h-[500px] flex flex-col justify-between">
            {!isEditing ? (
                <div className="flex flex-col items-center gap-4">
                    <h2 className="text-lg font-semibold">
                        Особиста інформація
                    </h2>

                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                        {preview ? (
                            <img
                                src={preview}
                                alt="avatar"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                                Немає фото
                            </div>
                        )}
                    </div>

                    <div className="text-center space-y-1">
                        <p className="font-medium">{user.fullName}</p>
                        <p className="text-gray-500 text-sm">{user.email}</p>
                        <p className="text-gray-500 text-sm">
                            Зареєстрований: {formatDate(user.createdAt)}
                        </p>
                    </div>

                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-2 border rounded-lg hover:bg-gray-100"
                    >
                        Редагувати профіль
                    </button>

                    <button
                        onClick={handleDeleteProfile}
                        className="px-6 py-2 border-3 border-red-500 text-red-500 rounded-lg hover:bg-red-50"
                    >
                        Видалити профіль
                    </button>
                </div>
            ) : (
                <>
                    <div className="flex flex-col items-center gap-4">
                        <h2 className="text-lg font-semibold">
                            Редагування профілю
                        </h2>

                        <div className="relative w-[150px] h-[150px] rounded-full overflow-hidden group">
                            <img
                                src={preview || "/noimage.png"}
                                alt="avatar"
                                className="w-full h-full object-cover"
                            />

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                id="avatarUpload"
                            />

                            <label
                                htmlFor="avatarUpload"
                                className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-sm opacity-0 group-hover:opacity-100 transition cursor-pointer"
                            >
                                Змінити
                            </label>
                        </div>
                    </div>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSave();
                        }}
                        className="flex flex-col gap-4 mt-6"
                    >
                        <input
                            value={formState.firstName}
                            onChange={(e) =>
                                handleChange("firstName", e.target.value)
                            }
                            className="border-b border-gray-400 p-2 focus:outline-none focus:border-black"
                            placeholder="Ім'я"
                            required
                        />

                        <input
                            value={formState.lastName}
                            onChange={(e) =>
                                handleChange("lastName", e.target.value)
                            }
                            className="border-b border-gray-400 p-2 focus:outline-none focus:border-black"
                            placeholder="Прізвище"
                            required
                        />

                        <input
                            value={formState.phoneNumber ?? ""}
                            onChange={(e) =>
                                handleChange("phoneNumber", e.target.value)
                            }
                            className="border-b border-gray-400 p-2 focus:outline-none focus:border-black"
                            placeholder="Телефон"
                        />

                        <input
                            type="email"
                            value={formState.email}
                            onChange={(e) =>
                                handleChange("email", e.target.value)
                            }
                            className="border-b border-gray-400 p-2 focus:outline-none focus:border-black"
                            placeholder="Email"
                            required
                        />

                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="w-full py-3 border rounded-lg hover:bg-gray-100"
                            >
                                Скасувати
                            </button>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 rounded-lg bg-black text-white hover:opacity-90 disabled:opacity-50"
                            >
                                {isLoading ? "Збереження..." : "Зберегти"}
                            </button>
                        </div>
                    </form>
                </>
            )}
            <ToastContainer
                position="bottom-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
};

export default ProfileSection;