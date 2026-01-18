export interface RegisterFormProps {}

export interface MessageState {
  text: string;
  type: 'success' | 'error' | 'info' | 'warning' | '';
}

export interface FormState {
  username: string;
  password: string;
}
