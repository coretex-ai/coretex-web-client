import { Snackbar as MUISnackbar } from "@mui/material";
import { ISnackbar } from "interfaces/Snackbar";
import "./Snackbar.css";

const AUTOHIDE_DURATION = 3000; // in ms

const Snackbar = ({ severity, ...rest }: ISnackbar) => {
  return (
    <div className={`snackbar_wrapper ${severity}`}>
      <MUISnackbar autoHideDuration={AUTOHIDE_DURATION} {...rest} />
    </div>
  );
};

export default Snackbar;
