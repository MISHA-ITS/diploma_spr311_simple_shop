export const saveLocalStorage = (key: string, value: string) => {
    try {
        localStorage.setItem(key, value);
    } catch (error) {
        console.error("Error saving to storage", error);
    }
};

export const getLocalStorage = (key: string) => {
    try {
        return localStorage.getItem(key);
    } catch (error) {
        console.error("Error reading from storage", error);
        return null;
    }
};

export const deleteLocalStorage =  (key: string) => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error("Error removing from storage", error);
    }
};
