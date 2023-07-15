import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

export const MOBILE_NUMBER_REGEX = /^[9][678][0-9]{8}$/;
@ValidatorConstraint({ name: 'isPhoneNumberValid', async: true })
export class IsValidMobileNumber implements ValidatorConstraintInterface {

    async validate(text: string, args: ValidationArguments) {
        return MOBILE_NUMBER_REGEX.test(text);;
    }
    defaultMessage(args: ValidationArguments) {
        return "Invalid Mobile Number"
    }
}