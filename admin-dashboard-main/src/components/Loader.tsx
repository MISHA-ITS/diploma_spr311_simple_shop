import {FC} from "react";

const Loader: FC = () => {
    return (
        <div className="flex justify-center items-center py-10">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
    );
};

export default Loader;