export interface ResetPasswordFormProps {
  token: string;
}

export interface MessageState {
  text: string;
  type: 'success' | 'error' | 'info' | 'warning' | '';
}

export interface FormState {
  password: string;
  confirmPassword: string;
}
