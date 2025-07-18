export const slugify = (str) => {
  if (!str || typeof str !== 'string') return ''; // tránh lỗi nếu null/undefined
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
};


export const parseSlug = (slugWithId) => {
  const parts = slugWithId.split("-");
  return Number(parts[parts.length - 1]);
};   