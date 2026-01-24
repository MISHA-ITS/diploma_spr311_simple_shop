import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import {IUserItem} from "../../pages/Users/types.ts";
import {useEffect, useState} from "react";
import noimage from "../../assets/images/noimage.jpeg";
import EnvConfig from "../../config/env.ts";
import {useUpdateUserMutation} from "../../services/apiUser.ts";

const urlUserImage = `${EnvConfig.API_URL}/images/users`;

type Props = {
  user: IUserItem;
};

const UserInfoCard: React.FC<Props> = ({ user }) => {
  const [updateUser] = useUpdateUserMutation();
  const { isOpen, openModal, closeModal } = useModal();
  const [preview, setPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    roles: "",
    imageFile: null as File | null,
  });

  // 🟢 Ініціалізація форми
  useEffect(() => {
    if (isOpen) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber ? user.phoneNumber : "",
        roles: user.roles.join(", "),
        imageFile: null,
      });

      setPreview(
          user.image
              ? `${urlUserImage}/200_${user.image}`
              : null
      );
    }
  }, [isOpen, user]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData(prev => ({ ...prev, imageFile: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    console.log("🔥 handleSave called");
    const payload = new FormData();

    payload.append("Id", user.id.toString());
    payload.append("FirstName", formData.firstName);
    payload.append("LastName", formData.lastName);
    payload.append("Email", formData.email);
    payload.append("Phone", formData.phoneNumber);
    payload.append("Roles", formData.roles);

    if (formData.imageFile) {
      payload.append("Image", formData.imageFile);
    }

    try {
      const updated = await updateUser(payload).unwrap();
      console.log("UPDATED USER:", updated);
      closeModal();
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  return (
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Особиста інформація
            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Ім'я
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {user.firstName}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Прізвище
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {user.lastName}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Електронна адреса
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {user.email}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Номер телефону
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {user.phoneNumber}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Ролі
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {user.roles}
                </p>
              </div>
            </div>
          </div>

          <button
              onClick={openModal}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            <svg
                className="fill-current"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
              <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                  fill=""
              />
            </svg>
            Редагувати
          </button>
        </div>

        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
          <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
            <div className="px-2 pr-14">
              <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                Редагувати особисту інформацію
              </h4>
              <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                Оновіть свої дані, щоб ваш профіль залишався актуальним.
              </p>
            </div>
            <form className="flex flex-col">
              <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">

                <div className="flex justify-center">
                  <div className="relative w-[150px] h-[150px] rounded-full overflow-hidden group">
                    {/* IMAGE */}
                    <img
                        src={preview || noimage}
                        alt="avatar"
                        className="w-full h-full object-cover"
                    />

                    img src={`${urlUserImage}/200_${user.image}`} alt="user" /

                    {/* HIDDEN FILE INPUT */}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handlePickImage}
                        className="hidden"
                        id="avatarUpload"
                    />

                    {/* OVERLAY BUTTON */}
                    <label
                        htmlFor="avatarUpload"
                        className="
                            absolute inset-0
                            flex items-center justify-center
                            bg-black/40 text-white text-sm font-medium
                            opacity-0 group-hover:opacity-100
                            transition-all duration-200
                            cursor-pointer
                          "
                    >
                      {preview ? "Змінити зображення" : "Обрати зображення"}
                    </label>
                  </div>
                </div>

                <div className="mt-7">
                  <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                    Особиста інформація
                  </h5>

                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                    <div className="col-span-2 lg:col-span-1">
                      <Label>Ім'я</Label>
                      <Input
                          value={formData.firstName}
                          onChange={e => handleChange("firstName", e.target.value)}
                      />
                    </div>

                    <div className="col-span-2 lg:col-span-1">
                      <Label>Прізвище</Label>
                      <Input
                          value={formData.lastName}
                          onChange={e => handleChange("lastName", e.target.value)}
                      />
                    </div>

                    <div className="col-span-2 lg:col-span-1">
                      <Label>Адреса електронної пошти</Label>
                      <Input
                          type="email"
                          value={formData.email}
                          onChange={e => handleChange("email", e.target.value)}
                      />
                    </div>

                    <div className="col-span-2 lg:col-span-1">
                      <Label>№ телефону</Label>
                      <Input
                          value={formData.phoneNumber}
                          onChange={e => handleChange("phoneNumber", e.target.value)}
                      />
                    </div>

                    <div className="col-span-2">
                      <Label>Ролі</Label>
                      <Input
                          value={formData.roles}
                          onChange={e => handleChange("roles", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                <Button size="sm" variant="outline" onClick={closeModal}>
                  Закрити
                </Button>
                <Button size="sm" onClick={handleSave}>
                  Зберегти зміни
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
  );
}

export default UserInfoCard;
