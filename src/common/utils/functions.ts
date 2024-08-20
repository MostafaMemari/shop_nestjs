export function formatErrorMessage(errorMessage: string): string {
  return errorMessage
    .replace(/"/g, '')
    .replace(/\s*{\s*/g, '{ ')
    .replace(/\s*}\s*/g, ' }')
    .replace(/\s*:\s*/g, ': ')
    .replace(/\s+/g, ' ')
    .trim();
}
