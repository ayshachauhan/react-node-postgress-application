export function indexBy<K extends keyof T, T>(key: K, array: T[]): Record<string, T> {
    return array.reduce((acc, curr) => {
        acc[curr[key] as unknown as string] = curr;
        return acc;
    }, {} as Record<string, T>);
}