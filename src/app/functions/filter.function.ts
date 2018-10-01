export function uniqueValue(value, index, self) {
    return self.indexOf(value) === index;
}

export function notNullValue(value, index, self) {
    return !!value;
}

export function uniqueAndNotNullValue(value, index, self) {
    return !!value && self.indexOf(value) === index;
}
