export class ValidationService {
    static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
        const config = {
            'required': 'The value is required',
            'pattern': 'The value does not match the pattern',
            'name': 'Enter a name',
            'minlength': `Minimum amount is ${validatorValue.requiredLength}`,
            'maxlength': `Maximum amount is ${validatorValue.requiredLength}`,
        };
        return config[validatorName];
    }
}
