export const required = (name) => (value) => {
  if (!value) {
    return `${name} is required`;
  }

  return null;
};