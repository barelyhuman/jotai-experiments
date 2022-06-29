import { useAtom } from 'jotai'
import { atomWithValidate } from 'jotai-form'
import { atomsWithForm } from 'jotai-experiments'
import * as Yup from 'yup'

const emailValidation = Yup.string().email().required()
const formValidation = Yup.object().shape({
  email: emailValidation,
})

const emailAtom = atomWithValidate('', {
  validate(v) {
    return emailValidation.validate(v)
  },
})

const formAtom = atomsWithForm(
  {
    email: emailAtom,
  },
  {
    validate(v: any) {
      return formValidation.validate(v)
    },
  }
)

export default function Form2() {
  const [form,setForm] = useAtom(formAtom)
  return (
    <>
      <input value={(form as any).value.email} onChange={e => setForm({email:e.target.value})} />
      <p>Validating: {(form as any).validating ? 'true' : 'false'}</p>
      <p>
        Error: <pre>{String((form as any).error)}</pre>
      </p>
    </>
  )
}
