export const API_BASE_URL = "https://celestia-server-sepia.vercel.app/api";
export const AUTH_TOKEN_KEY = "celestia-auth-token";
export const AUTH_USER_KEY = "celestia-auth-user";
export const AUTH_EVENT_NAME = "celestia-auth-change";

const emitAuthChange = () => {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent(AUTH_EVENT_NAME));
    }
};

export const readAuthUser = () => {
    try {
        const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
        const savedUser = window.localStorage.getItem(AUTH_USER_KEY);
        if (!token || !savedUser) return null;

        const user = JSON.parse(savedUser);
        if (
            !user ||
            typeof user.name !== "string" ||
            typeof user.email !== "string"
        ) {
            throw new Error("Saved account data is invalid.");
        }

        return user;
    } catch (error) {
        console.error("Could not load the saved account:", error);
        return null;
    }
};

export const saveAuthSession = (token, user) => {
    if (
        typeof token !== "string" ||
        !token ||
        !user ||
        typeof user.name !== "string" ||
        typeof user.email !== "string"
    ) {
        throw new Error("The server returned invalid account details.");
    }

    window.localStorage.setItem(AUTH_TOKEN_KEY, token);
    window.localStorage.setItem(
        AUTH_USER_KEY,
        JSON.stringify({
            name: user.name,
            email: user.email,
            role: typeof user.role === "string" ? user.role : "user"
        })
    );
    emitAuthChange();
};

export const clearAuthSession = () => {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
    window.localStorage.removeItem(AUTH_USER_KEY);
    emitAuthChange();
};
