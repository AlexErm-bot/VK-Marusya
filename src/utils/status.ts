export const getStatus = (code: string | null) => {
    if (!code) return '—';

    try {
        if (code === 'released') return "Фильм вышел в прокат";
    } catch (error) {
        return code;
    }
};