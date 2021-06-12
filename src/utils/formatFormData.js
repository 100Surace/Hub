export function convertToFormData(values) {
  const formData = new FormData();
  Object.keys(values).forEach((key) => {
    if (values[key]) {
      if (typeof values[key] === 'object') {
        if (Object.values(values[key]).length) {
          formData.append(key, values[key]);
        }
      } else {
        formData.append(key, values[key]);
      }
    }
  });
  return formData;
}
