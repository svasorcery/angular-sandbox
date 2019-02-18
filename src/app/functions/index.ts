import { saveAs } from './file-save-as.function';
import { uniqueValue, notNullValue, uniqueAndNotNullValue } from './filter.function';
import { byAsc, byDesc } from './sort.function';

export const functions = [
    saveAs,

    uniqueValue,
    notNullValue,
    uniqueAndNotNullValue,

    byAsc,
    byDesc
];
