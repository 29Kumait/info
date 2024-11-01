type AnyObject = Record<string, unknown>;

export function sanitizeEventData<T extends AnyObject>(rawData: T): T {
    const data = structuredClone(rawData);

    const sensitiveFields = new Set([
        "email",
        "private",
        "node_id",
        "gravatar_id",
        "site_admin",
    ]);

    function removeSensitiveInfo(obj: AnyObject) {
        if (Array.isArray(obj)) {
            obj.forEach(removeSensitiveInfo);
        } else if (typeof obj === "object" && obj !== null) {
            for (const key in obj) {
                if (sensitiveFields.has(key)) {
                    delete obj[key];
                } else if (typeof obj[key] === "object" && obj[key] !== null) {
                    removeSensitiveInfo(obj[key] as AnyObject);
                }
            }
        }
    }

    removeSensitiveInfo(data);
    return data;
}
