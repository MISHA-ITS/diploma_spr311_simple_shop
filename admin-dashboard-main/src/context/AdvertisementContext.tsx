import {createContext, useContext, useEffect, useState} from 'react';
import {IArea, ISettlement} from "../models/newPost.ts";
import {Outlet} from "react-router-dom";

interface AdFormData {
    title: string;
    description: string;
    price: string;
    phone: string;
    categoryId: number | null;
    images: File[];
    previews: string[];
    selectedArea: IArea | null;
    selectedSettlement: ISettlement | null;
}

interface FormContextType {
    formData: AdFormData;
    updateFormData: (data: Partial<AdFormData>) => void;
    clearForm: () => void;
}

const AdvertisementContext = createContext<FormContextType | undefined>(undefined);

export const AdvertisementProvider = () => {
    const [formData, setFormData] = useState<AdFormData>(() => {
        const saved = localStorage.getItem("ad_form_cache");
        const initialValues = {
            title: "", description: "", price: "", phone: "",
            categoryId: null, images: [], previews: [],
            selectedArea: null, selectedSettlement: null,
        };

        if (saved) {
            const parsed = JSON.parse(saved);
            return { ...initialValues, ...parsed };
        }
        return initialValues;
    });

    useEffect(() => {
        // Зберігаємо лише текст та об'єкти локацій
        const { images, previews, ...rest } = formData;
        localStorage.setItem("ad_form_cache", JSON.stringify(rest));
    }, [formData]);

    const updateFormData = (data: Partial<AdFormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const clearForm = () => setFormData({
        title: "", description: "", price: "", phone: "", categoryId: null, images: [], previews: [],selectedArea: null, selectedSettlement: null
    });

    return (
        <AdvertisementContext.Provider value={{ formData, updateFormData, clearForm }}>
            <Outlet />
        </AdvertisementContext.Provider>
    );
};

export const useAdForm = () => {
    const context = useContext(AdvertisementContext);
    if (!context) throw new Error("useAdForm must be used within FormProvider");
    return context;
};