import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api/v1",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    }
});

let refreshPromise = null;

const clearAuthState = () => {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth:logout"));

    if (window.location.pathname !== "/login") {
        window.location.assign("/login");
    }
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;
        const requestUrl = originalRequest?.url || "";

        if (
            !originalRequest ||
            status !== 401 ||
            originalRequest._retry ||
            requestUrl.includes("/auth/refreshAccessToken")
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            if (!refreshPromise) {
                refreshPromise = api.post("/auth/refreshAccessToken").finally(() => {
                    refreshPromise = null;
                });
            }

            await refreshPromise;

            return api(originalRequest);
        } catch (refreshError) {
            clearAuthState();
            return Promise.reject(refreshError);
        }
    }
);

export default api;