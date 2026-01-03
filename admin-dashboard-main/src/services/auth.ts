import EnvConfig from "../config/env.ts";

export const loginByGoogleApi = async (googleToken: string) => {
    const response = await fetch(
        `${EnvConfig.API_URL}/api/account/googleLogin`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token: googleToken,
            }),
        }
    );

    if (!response.ok) {
        throw new Error("Google login failed");
    }

    return await response.json();
};