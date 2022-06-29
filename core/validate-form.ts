import { atom } from 'jotai'

export const validateAtom = validator => {
  const baseState = {
    isValid: true,
    error: null,
    isValidating: false,
  }

  const baseAtom = atom(baseState)

  const validationAtom = atom(
    get => get(baseAtom),
    (get, set) => {
      try {
        const prev = get(baseAtom)
        const onValidate = validator(get)
        if (onValidate instanceof Promise) {
          const _nextPending = {
            isValid: prev.isValid,
            error: prev.error,
            isValidating: true,
          }

          set(baseAtom, _nextPending)

          onValidate
            .then(() => {
              const _next = {
                isValid: true,
                error: null,
                isValidating: false,
              }
              set(baseAtom, _next)
            })
            .catch(err => {
              const _next = {
                isValid: false,
                error: err,
                isValidating: false,
              }
              set(baseAtom, _next)
            })
        } else {
          const _next = {
            isValid: true,
            error: null,
            isValidating: false,
          }
          set(baseAtom, _next)
        }
      } catch (err) {
        const _next = {
          isValid: false,
          error: err,
          isValidating: false,
        }
        set(baseAtom, _next)
      }
    }
  )

  return validationAtom
}
