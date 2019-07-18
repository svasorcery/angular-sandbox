import { Base64Validator } from './base64.validator';
import { CreditCardValidator } from './credit-card-number.validator';
import { DateRangeValidator } from './date-range.validator';
import { DigitsValidator } from './digit.validator';
import { EmailValidator } from './email.validator';
import { JsonValidator } from './json.validator';
import { MatchValueValidator } from './match-value.validator';
import { UrlValidator } from './url.validator';
import { UUIDValidator } from './uuid.validator';

export const validators = [
    Base64Validator,
    CreditCardValidator,
    DateRangeValidator,
    DigitsValidator,
    EmailValidator,
    JsonValidator,
    MatchValueValidator,
    UrlValidator,
    UUIDValidator
];
