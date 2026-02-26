import apiClient from "./api-client";

export const resendActivation = (email) => {
  return apiClient.post("/auth/users/resend_activation/", { email });
};