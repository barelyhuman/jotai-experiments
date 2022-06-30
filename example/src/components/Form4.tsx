import { useAtom } from 'jotai'
import { validateAtomLoadable } from 'jotai-experiments'
import { atomWithValidate } from 'jotai-form'
import { useEffect } from 'react'
import * as Yup from 'yup'

const emailAtom = atomWithValidate('ahoy@barelyhuman.dev', {
  validate(v) {
    return Yup.string().email().required().validate(v)
  },
})

const nameAtom = atomWithValidate('', {
  validate(v) {
    return Yup.string().required().validate(v)
  },
})

const formValidatorAtom = validateAtomLoadable((get: any) => {
  return new Promise(resolve => {
    // forced timeout to see the validation on the view
    setTimeout(() => {
      const _email = get(emailAtom).value
      const _name = get(nameAtom).value

      resolve(
        Yup.object()
          .shape({
            email: Yup.string().matches(
              /^me@barelyhuman.dev$/,
              "You're not our master!"
            ),
            name: Yup.string().max(12),
          })
          .validate({
            email: _email,
            name: _name,
          })
      )
    }, 2500)
  })
})

export default function Form4() {
  const [email, setEmail] = useAtom(emailAtom)
  const [name, setName] = useAtom(nameAtom)
  const [form] = useAtom(formValidatorAtom)

  useEffect(()=>{
    console.log({ form })
  },[form])

  return (
    <>
      <input
        type="email"
        placeholder="email"
        value={email.value}
        onChange={e => {
          setEmail(e.target.value)
        }}
      />
      <input
        type="text"
        placeholder="Name"
        value={name.value}
        onChange={e => {
          setName(e.target.value)
        }}
      />
      <p>validating: {form.isValidating ? 'true' : 'false'}</p>
      <p>
        valid:{' '}
        {form.isValid ? 'true' : 'false'}
      </p>
      <p>
        error:{' '}
        {form.error ? String(form.error) : null}
      </p>
    </>
  )
}
