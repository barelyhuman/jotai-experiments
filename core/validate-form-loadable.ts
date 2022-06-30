import { atom } from 'jotai'
import { loadable } from 'jotai/utils'

export const validateAtomLoadable = validator => {
  const baseAtom = atom(async get => {
    return validator(get)
  })

  const derv = atom(get => {
    const _validatorState = get(loadable(baseAtom))
    const next: any = {
      isValid: true,
      error: null,
    }

    if (_validatorState.state === 'loading') next.isValidating = true

    if (_validatorState.state === 'hasError') {
      next.isValid = false
      next.error = _validatorState.error
    }

    if (_validatorState.state === 'hasData') {
      next.isValid = true
      next.error = null
    }

    return next
  })

  return derv
}
