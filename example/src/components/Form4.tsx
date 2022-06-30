import { useAtom } from "jotai";
import {  validateAtomLoadable } from "jotai-experiments";
import { atomWithValidate } from "jotai-form";
import * as Yup from "yup";

const emailAtom = atomWithValidate("ahoy@barelyhuman.dev", {
  validate(v) {
    return Yup.string().email().required().validate(v);
  },
});

const formValidatorAtom = validateAtomLoadable((get: any) => {
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

export default function Form4() {
  const [email, setEmail] = useAtom(emailAtom);
  const [form] = useAtom(formValidatorAtom);
  return (
    <>
      <input
        type="email"
        placeholder="email"
        value={email.value}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <p>validating: {form.state==="loading" ? "true" : "false"}</p>
      <p>valid: {form.state==="hasData" && form.data?.isValid ? "true" : "false"}</p>
      <p>
        error: {form.state==="hasError" && form.error ? String(form.error) : null}
      </p>
    </>
  );
}
