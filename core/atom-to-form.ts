import { atom } from 'jotai'

export const atomsToForm = (atoms, { validate }) => {
  return atom(
    get => {
      let valid = true
      let dirty = false

      const values = Object.fromEntries(
        Object.entries(atoms).map(([k, v]: [k: any, v: any]) => {
          const val: any = get(v)

          if (val.isDirty) dirty = true

          if (val.error) valid = false

          return [k, val]
        })
      )

      // separated for dev reasons
      const result: any = {
        errors: [],
        values,
        isValid: valid,
        isDirty: dirty,
      }

      try {
        const _validation = validate(values)
        if (_validation instanceof Promise) {
          result.isValidating = true
          _validation
            .then(() => {
              result.isValidating = false
            })
            .catch(err => {
              result.isValidating = false
              result.isValid = false
              result.errors.push(err)
            })
        }
      } catch (err) {
        if (result.isValidating) result.isValidating = false

        result.isValid = false
        result.errors.push(err)
      }

      return result
    },
    (get, set, arg: any) => {
      if (atoms[arg.key]) set(atoms[arg.key], arg.value)
    }
  )
}
