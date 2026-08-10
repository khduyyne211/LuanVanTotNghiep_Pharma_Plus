import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api",
});

apiClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("pharma_access_token");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use((response) => response, (error) => {

    const apiUrl = String(error.config?.url || "");

    /*
     * Các API xác thực có thể trả 401 vì dữ liệu
     * đăng nhập hoặc Firebase ID Token không hợp lệ.
     * Đây không phải trường hợp JWT Pharma+ hết hạn.
     */
    const laApiXacThuc = apiUrl.includes("/xac-thuc/");

    if (error.response?.status === 401 && !laApiXacThuc) {
      localStorage.removeItem("pharma_access_token");

      localStorage.removeItem("pharma_nguoi_dung");

      window.dispatchEvent(new Event("pharma:dang-xuat"));
    }

    return Promise.reject(error);
  }
);

export default apiClient;