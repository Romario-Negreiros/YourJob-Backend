const checkFieldsNotNull = (fields: Object): null | string => {
  for (const field in fields) {
    if (!fields[field]) {
      return `${field.charAt(0).toUpperCase() + field.substring(1)} field is required!`
    }
  }
}

export default checkFieldsNotNull
