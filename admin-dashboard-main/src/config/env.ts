class EnvConfig {
    static readonly API_URL: string = import.meta.env.VITE_API_URL as string;
    static readonly USER_IMAGES_URL: string = import.meta.env.VITE_USER_IMAGES_URL as string;
    static readonly GOOGLE_CLIENT_ID: string = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
    static readonly GOOGLE_USERINFO_URL: string = import.meta.env.VITE_GOOGLE_USERINFO_URL as string;
    // Якщо потім треба буде додати інші змінні:
    // static readonly APP_NAME: string = import.meta.env.VITE_APP_NAME as string;
}

export default EnvConfig;