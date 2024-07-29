import { AlertColor } from "@mui/material/Alert";

export interface ISnackbar {
  open: boolean;
  severity?: AlertColor;
  message?: string;
}

export interface SnackbarProps extends ISnackbar {
  onClose: () => void;
}
