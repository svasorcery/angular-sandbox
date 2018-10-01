export function byAsc(key: string = null) {
    return (a, b) => {
        const x = key ? a[key] : a;
        const y = key ? b[key] : b;
        return x > y ? 1 : x < y ? -1 : 0;
    };
}

export function byDesc(key: string = null) {
    return (a, b) => {
        const x = key ? a[key] : a;
        const y = key ? b[key] : b;
        return x < y ? 1 : x > y ? -1 : 0;
    };
}
