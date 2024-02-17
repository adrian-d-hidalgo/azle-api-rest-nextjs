/**
 * Parses an array of header key-value pairs into a JavaScript object.
 * 
 * @param {Array<[string, string]>} headers - The array of header key-value pairs.
 * @returns {Record<string, string>} An object representing the headers with keys as header names and values as header values.
 */
export function parseHeadersResponse(headers: [string, string][]): Record<string, string> {
    return headers.reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
}

/**
 * Converts a Uint8Array or an array of numbers into a string or an array of numbers,
 * based on the type of data it represents.
 * 
 * @param {Uint8Array | number[]} data The data to be converted, which can be either a Uint8Array or an array of numbers.
 * @returns {string | number[] | null} The converted data. If the input represents a string, it returns a string. If it represents an array of numbers, it returns an array of numbers. If the input cannot be converted to either, it returns null.
 */
export function parseBodyResponse(data: Uint8Array | number[]): any {
    // Check if the body is a Uint8Array
    if (data instanceof Uint8Array) {
        // Attempt to convert the Uint8Array to a string
        const stringData = (() => {
            try {
                const decoder = new TextDecoder('utf-8');
                return decoder.decode(data);
            } catch (error) {
                return null; // Not a string
            }
        })();

        if (stringData !== null) {
            try {
                return JSON.parse(stringData);
            } catch (error) {
                return stringData;
            }
        }

        // If it's not a string, convert to an array of numbers
        return Array.from(data);
    }

    // Check if the body is an array of numbers
    if (Array.isArray(data) && data.every(element => typeof element === 'number')) {
        return data;
    }

    // If it's neither a Uint8Array nor an array of numbers, return null
    return null;
}
