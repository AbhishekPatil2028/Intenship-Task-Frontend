export const passwordRules = [
  {
    label: "At least 8 characters",
    test: (password) => password.length >= 8,
  },
  {
    label: "At least 1 uppercase letter",
    test: (password) => /[A-Z]/.test(password),
  },
  {
    label: "At least 1 lowercase letter",
    test: (password) => /[a-z]/.test(password),
  },
  {
    label: "At least 1 number",
    test: (password) => /\d/.test(password),
  },
  {
    label: "At least 1 special character (@$!%*?)",
    test: (password) => /[@$!%*?&]/.test(password),
  },
];
