import { atom } from 'jotai'

// approach 2,
// recreate the entire atomWithValidate but instead use named atoms
// bad idea
// uses a lot of re-renders
// TODO:
// 1. remove the baseAtom creation as the atoms are already created
// 2. change the setter to be key specific

export function atomsWithForm<Value>(labeledAtoms: any, options: any) {
  const { areEqual = Object.is, validate } = options
  let initialState = {}
  let initialPromise: Promise<Value> | undefined
  const values = Object.fromEntries(
    Object.entries(labeledAtoms).map(([k, v]: [k: any, v: any]) => {
      const val: any = v.read
      return [k, val.value]
    })
  )

  try {
    const initialValidatedValue = validate(values)
    if (initialValidatedValue instanceof Promise) {
      initialPromise = initialValidatedValue
      initialState = {
        value: values,
        isDirty: false,
        isValidating: true,
      }
    } else {
      initialState = {
        value: values,
        isDirty: false,
        isValid: true,
      }
    }
  } catch (error) {
    initialState = {
      value: values,
      isDirty: false,
      isValid: false,
      error,
    }
  }
  const baseAtom = atom(initialState)
  baseAtom.onMount = setValue => {
    if (initialPromise) {
      initialPromise
        .then(resolvedValue => {
          const nextState = {
            value: resolvedValue,
            isDirty: !areEqual(values, resolvedValue),
            isValidating: false,
            isValid: true,
          }
          setValue(nextState)
        })
        .catch(error => {
          const nextState = {
            value: values,
            isDirty: false,
            isValidating: false,
            isValid: false,
            error,
          }
          setValue(nextState)
        })
    }
  }
  const derivedAtom = atom(
    get => get(baseAtom),
    (get, set, action) => {
      const prevState = get(baseAtom)
      const nextValue =
        typeof action === 'function' ? (action as any)(prevState.value) : action
      try {
        const validatedValue = validate(nextValue)
        if (validatedValue instanceof Promise) {
          const pendingState = {
            value: nextValue,
            isDirty: !areEqual(values, nextValue),
            isValidating: true,
          }
          set(baseAtom, pendingState)
          validatedValue
            .then(resolvedValue => {
              const nextState = {
                value: resolvedValue,
                isDirty: !areEqual(values, resolvedValue),
                isValidating: false,
                isValid: true,
              }
              set(baseAtom, prev => (prev === pendingState ? nextState : prev))
            })
            .catch(error => {
              const nextState = {
                value: nextValue,
                isDirty: !areEqual(values, nextValue),
                isValidating: false,
                isValid: false,
                error,
              }
              set(baseAtom, prev => (prev === pendingState ? nextState : prev))
            })
        } else {
          const nextState = {
            value: validatedValue,
            isDirty: !areEqual(values, validatedValue),
            isValid: true,
          }
          set(baseAtom, nextState)
        }
      } catch (error) {
        const nextState = {
          value: nextValue,
          isDirty: !areEqual(values, nextValue),
          isValid: false,
          error,
        }
        set(baseAtom, nextState)
      }
    }
  )
  return derivedAtom
}
