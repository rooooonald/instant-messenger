import { useState } from "react";

export default function useInput(validate, defaultValue) {
  const [value, setValue] = useState(defaultValue ? defaultValue : "");
  const [isTouched, setIsTouched] = useState(false);

  const valueIsValid = validate(value);
  const hasError = !valueIsValid && isTouched;

  const valueChangeHandler = (e) => {
    setValue(e.target.value);
  };

  const blurHandler = () => {
    setIsTouched(true);
  };

  const resetHandler = () => {
    setValue("");
    setIsTouched(false);
  };

  return {
    value,
    isTouched,
    valueIsValid,
    hasError,
    valueChangeHandler,
    blurHandler,
    resetHandler,
  };
}
