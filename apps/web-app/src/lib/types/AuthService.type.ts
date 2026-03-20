interface RegisterData {
    name: string;
    email: string;
    phone: string;
    password: string;
}

interface RegisterResponse {
    id: string;
    name: string;
    email: string;
    phone: string;
}

interface LoginData {
    email: string;
    password: string;
}

interface LoginResponse {
    message: string;
}

interface ForgotPasswordData {
    email: string;
}

interface ForgotPasswordResponse {
    message: string;
}

interface ResetPasswordData {
    email: string;
    otp: string;
    newPassword: string;
}

interface ResetPasswordResponse {
    message: string;
}

export type {
    RegisterData,
    RegisterResponse,
    LoginData,
    LoginResponse,
    ForgotPasswordData,
    ForgotPasswordResponse,
    ResetPasswordData,
    ResetPasswordResponse,
}