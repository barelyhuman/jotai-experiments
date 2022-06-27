import { useAtom } from "jotai";
import { atomWithValidate } from "jotai-form";
import { atomsToForm } from "jotai-experiments";

const firstNameAtom = atomWithValidate("", {
  validate: (v) => {
    if (v.length > 4) return v;
    else throw new Error("First Name should be greater than 4 character");
  }
});

const lastNameAtom = atomWithValidate("", {
  validate: (v) => {
    if (v.length > 4) return v;
    else throw new Error("Last Name should be greater than 4 character");
  }
});

const emailAtom = atomWithValidate("", {
  validate: (v) => {
    if (v.endsWith("@gmail.com")) {
      return v;
    }
    throw new Error("Invalid email");
  }
});

const formAtom = atomsToForm(
  {
    email: emailAtom,
    firstName: firstNameAtom,
    lastName: lastNameAtom
  },
  {
    validate: async (values:any) => {
      if (values.firstName.value.length + values.lastName.value.length > 12) {
        throw new Error("Combined Name length too long");
      }
    }
  }
);

export default function App() {
  const [formData, setFormData] = useAtom(formAtom);
  return (
    <div className="App">
      <input
      placeholder="email"
        value={formData.email}
        onChange={(e) => setFormData({ key: "email", value: e.target.value })}
      />

      <div>
        <input
          placeholder="firstName"
          value={formData.firstName}
          onChange={(e) =>
            setFormData({ key: "firstName", value: e.target.value })
          }
        />
        <input
          placeholder="lastName"
          value={formData.lastName}
          onChange={(e) =>
            setFormData({ key: "lastName", value: e.target.value })
          }
        />
      </div>
      <div>
        <ul>
          {formData.errors?.map((x:any) => (
            <li>{x.message}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
