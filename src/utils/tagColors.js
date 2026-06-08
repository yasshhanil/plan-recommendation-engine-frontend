export const getTagColor = (category, isMatched, isDark = false) => {
  if (isDark) {
    return isMatched
      ? {
          category: '#2563EB',
          vibe: '#6D28D9',
          special: '#0C6888',
          price: '#047857',
        }[category] ?? '#4B5563'
      : {
          category: '#1E3A8A',
          vibe: '#3B0764',
          special: '#164E63',
          price: '#14532D',
        }[category] ?? '#374151';
  }

  return isMatched
    ? {
        category: '#2563EB',
        vibe: '#7C3AED',
        special: '#0891B2',
        price: '#059669',
      }[category] ?? '#64748B'
    : {
        category: '#60A5FA',
        vibe: '#A78BFA',
        special: '#22D3EE',
        price: '#34D399',
      }[category] ?? '#94A3B8';
};
