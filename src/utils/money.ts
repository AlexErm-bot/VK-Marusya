export const getMoney = (code: number | null, currency = 'USD') => {
    if (!code) return '—';

    try {
        return new Intl.NumberFormat(['ru-RU'],
            {
                style: 'currency',
                currency: currency,
                maximumFractionDigits: 0
            }).format(code);
    } catch (error) {
        return code;
    }
};