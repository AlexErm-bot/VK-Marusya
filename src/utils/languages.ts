export const getLanguageName = (code: string) => {
  if (!code) return '—';
  
  try {
    return new Intl.DisplayNames(['ru'], { type: 'language' }).of(code);
  } catch (error) {
    return code.toUpperCase();
  }
};