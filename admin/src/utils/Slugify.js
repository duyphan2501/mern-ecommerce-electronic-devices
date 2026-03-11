export default function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Split an accented letter in the base letter and the accent
    .normalize('NFD') 
    // Remove all previously split accents
    .replace(/[\u0300-\u036f]/g, '') 
    // Replace invalid chars with spaces
    .replace(/[^a-z0-9\s-]/g, ' ') 
    // Replace multiple spaces or hyphens with a single hyphen
    .replace(/[\s-]+/g, '-') 
    // Trim leading and trailing hyphens
    .replace(/^-+|-+$/g, '');
}

