import { atom } from 'jotai'
import { loadable } from 'jotai/utils'

export const validateAtomLoadable = validator => {
  const baseAtom = atom(async get => {
    const onValidate = validator(get)
    if (onValidate instanceof Promise) {
      const validationData = await onValidate
      // return whatever is being returned from the validator func
      // for example
      return validationData
    } else {
      // return whatever is being returned from the validator func
      // for example
      return onValidate
    }
  })

  return loadable(baseAtom)
}
