export default class StringUtil {
    static trim(value: string) {
        if (!value || typeof value !== 'string') return value;
        return value.trim();
    }

    static lowerCaseAndTrim(value: string) {
        if (!value || typeof value !== 'string') return value;
        return value.toLowerCase().trim();
    }
}
