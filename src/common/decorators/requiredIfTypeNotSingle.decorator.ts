import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { ProductType } from 'src/modules/products/enum/productType.enum';

export function IsRequiredIfTypeNotSingle(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isRequiredIfTypeNotSingle',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const object = args.object as any;
          // بررسی اینکه اگر type برابر SINGLE نباشد، relatedProducts باید مقدار داشته باشد
          if (object.type !== ProductType.SINGLE && (!value || value.length === 0)) {
            return false;
          }
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `$property is required when type is not SINGLE`;
        },
      },
    });
  };
}
