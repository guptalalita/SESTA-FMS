import "date-fns";
import React from "react";
import PropTypes from "prop-types";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";

const Datepicker = ({ ...props }) => {
  const [clearedDate, handleClearedDateChange] = React.useState(null);
  const [selectedDate, setSelectedDate] = React.useState();

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <DatePicker
        clearable
        label={props.label}
        error={props.error ? props.error : false}
        helperText={props.helperText ? props.helperText : null}
        inputVariant="outlined"
        value={props.value ? props.value : clearedDate}
        onChange={props.onChange}
        format={props.format}
      />
    </MuiPickersUtilsProvider>
  );
};
Datepicker.propTypes = {
  classes: PropTypes.object.isRequired,
  labelText: PropTypes.node,
  labelProps: PropTypes.object,
  id: PropTypes.string.isRequired,
  control: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(["standard", "outlined", "filled"]),
};

export default Datepicker;
