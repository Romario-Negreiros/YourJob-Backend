const checkFieldsNotNull = (fields: Object): null | string => {
  const allowedFields = [
    'verifyEmailToken',
    'verifyTokenExpiration',
    'passwordResetToken',
    'resetTokenExpiration',
    'profilePicture',
    'curriculum',
    'companyLogo'
  ]
  for (const field in fields) {
    if (allowedFields.includes(field)) {
      continue
    }
    if (!fields[field]) {
      return `${field.charAt(0).toUpperCase() + field.substring(1)} field is required!`
    }
  }
}

export default checkFieldsNotNull
