import { useCallback, useMemo, useState } from "react";
import { ISnackbar, SnackbarProps } from "interfaces/Snackbar";

interface UseSnackbar {
  snackbar: SnackbarProps;
  onSetSnackbar: (args: SetSnackbarArgs) => void;
}

export type SetSnackbarArgs = Pick<ISnackbar, "message" | "severity">;

export const useSnackbar = (): UseSnackbar => {
  const [snackbarState, setSnackbarState] = useState<ISnackbar>({
    open: false,
  });

  const onSetSnackbar = useCallback(
    ({ message, severity }: SetSnackbarArgs) => {
      setSnackbarState({ open: true, severity, message });
    },
    []
  );

  const onCloseSnackbar = useCallback((): void => {
    setSnackbarState((prevSnackbar) => ({ ...prevSnackbar, open: false }));
  }, []);

  const snackbar = useMemo(
    (): SnackbarProps => ({ ...snackbarState, onClose: onCloseSnackbar }),
    [snackbarState, onCloseSnackbar]
  );

  return { snackbar, onSetSnackbar };
};
