import { useAtom } from "jotai";
import { validateAtom } from "jotai-experiments";
import { atomWithValidate } from "jotai-form";
import { useEffect } from "react";
import * as Yup from "yup";

const emailAtom = atomWithValidate("ahoy@barelyhuman.dev", {
  validate(v) {
    return Yup.string().email().required().validate(v);
  },
});

const formValidatorAtom = validateAtom((get: any) => {
  return new Promise((resolve) => {
    // forced timeout to see the validation on the view
    setTimeout(() => {
      const _email = get(emailAtom).value;
      resolve(
        Yup.string().matches(/^me@barelyhuman.dev$/, "You're not our master!")
        .validate(_email)
      )
    }, 2500);
  });
});

export default function Form3() {
  const [email, setEmail] = useAtom(emailAtom);
  const [form, validate] = useAtom(formValidatorAtom);

  // validate on mount
  useEffect(() => {
    validate();
  }, [validate]);

  return (
    <>
      <input
        type="email"
        placeholder="email"
        value={email.value}
        onChange={(e) => {
          setEmail(e.target.value);
          validate();
        }}
      />
      <p>validating: {form.isValidating ? "true" : "false"}</p>
      <p>valid: {form.isValid ? "true" : "false"}</p>
      <p>
        error: {form.error ? String(form.error) : null}
      </p>
    </>
  );
}
