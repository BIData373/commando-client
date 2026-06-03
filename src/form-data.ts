function appendValue(formData: FormData, key: string, value: unknown): void {
  if (value === undefined || value === null) return

  if (value instanceof File || value instanceof Blob) {
    formData.append(key, value)
  } else if (value instanceof Date) {
    formData.append(key, value.toISOString())
  } else if (Array.isArray(value)) {
    value.forEach((item) => {
      appendValue(formData, key, item)
    })
  } else if (typeof value === 'object') {
    Object.entries(value).forEach(([k, v]) => {
      appendValue(formData, `${key}[${k}]`, v)
    })
  } else {
    formData.append(key, String(value))
  }
}

export function serializeFormData<B>(body: B): FormData {
  const formData = new FormData()
  
  Object.entries(body as Record<string, unknown>).forEach(([key, value]) => {
    appendValue(formData, key, value)
  })
  
  return formData
}
