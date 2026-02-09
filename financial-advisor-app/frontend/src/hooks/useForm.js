import { useState } from 'react'

export const useForm = (initialValues, validationRules = {}) => {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched(prev => ({
      ...prev,
      [name]: true
    }))

    // Validate field on blur
    if (validationRules[name]) {
      const error = validationRules[name](values[name])
      if (error) {
        setErrors(prev => ({
          ...prev,
          [name]: error
        }))
      }
    }
  }

  const validate = () => {
    const newErrors = {}
    
    Object.keys(validationRules).forEach(field => {
      const error = validationRules[field](values[field])
      if (error) {
        newErrors[field] = error
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const reset = () => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate,
    reset,
    setValues,
    setErrors
  }
}