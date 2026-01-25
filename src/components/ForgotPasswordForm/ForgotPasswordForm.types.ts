export interface ForgotPasswordFormProps {}

export interface MessageState {
  text: string;
  type: 'success' | 'error' | 'info' | 'warning' | '';
}

export interface FormState {
  email: string;
}
