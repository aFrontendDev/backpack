export interface DashboardFormProps {
  onDataSaved?: () => void;
}

export interface MessageState {
  text: string;
  type: 'success' | 'error' | 'info' | 'warning' | '';
}

export interface FormState {
  key: string;
  value: string;
}
