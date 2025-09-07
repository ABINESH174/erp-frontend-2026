

export const isValidAlphabets = (value) => /^[A-Za-z\s]+$/.test(value);

export const isValidNumbers = (value) => /^[0-9]+$/.test(value);

export const isValidEmisNumber = (value) => /^[0-9]{11}$/.test(value);

export const isValidDecimal = (value) => /^(10(\.0+)?|[0-9](\.\d+)?)$/.test(value);

export const isValidMark = (value) => /^(100(\.0{1,4})?|([3-9][5-9]|[4-9][0-9])(\.[0-9]{1,4})?)$/.test(value);

export const isValidDiplomaMark = (value) => /^(100(\.0{1,4})?|([4-9][0-9])(\.[0-9]{1,4})?)$/.test(value);

export const isValidAadharNumber = (value) => /^\d{12}$/.test(value);

export const isValidMobileNumber = (value) => /^[6-9]\d{9}$/.test(value);

export const isValidEmail = (value) => /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value);

export const isValidAlphaNumeric = (value) => /^[A-Za-z0-9]+$/.test(value);
