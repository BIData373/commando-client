export function serializeFormData<B>(body: B): FormData {
  const formData = new FormData()

  Object.entries(body as Record<string, unknown>)
    .forEach(([key, value]) => {
      if (value === undefined || value === null) {
        return
      }
      
      if (value instanceof File || value instanceof Blob) {
        formData.append(key, value)
      } else if (value instanceof Date) {
        formData.append(key, value.toISOString())
      } else {
        formData.append(key, String(value))
      }
    })

  return formData
}
