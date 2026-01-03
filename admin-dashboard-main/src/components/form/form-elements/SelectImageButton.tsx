import {pickImage} from "../../../utils/pickImage.tsx";

const SelectImageButton = () => {
    const handlePick = async () => {
        const file = await pickImage();

        if (!file) return;

        console.log("Selected file:", file);

        // 🔹 Для preview
        const previewUrl = URL.createObjectURL(file);
        console.log(previewUrl);

        // 🔹 Для відправки на backend
        const formData = new FormData();
        formData.append("image", file);
    };

    return (
        <button onClick={handlePick}>
            Обрати зображення
        </button>
    );
};

export default SelectImageButton;
