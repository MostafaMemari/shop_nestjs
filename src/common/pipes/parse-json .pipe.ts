import { PipeTransform, BadRequestException } from '@nestjs/common';

export class ParseJsonPipe implements PipeTransform {
  transform(value: any): any {
    if (Array.isArray(value)) {
      return value;
    }

    if (typeof value === 'string') {
      try {
        let parsedData = JSON.parse(value);

        if (Array.isArray(parsedData)) {
          return parsedData
            .map((item) => {
              if (typeof item === 'string') {
                try {
                  return JSON.parse(item);
                } catch (e) {
                  return null;
                }
              }
              return item;
            })
            .filter((item) => item !== null);
        }
      } catch (error) {
        try {
          let parsedObject = JSON.parse(`[${value}]`);

          console.log(parsedObject);

          return parsedObject;
        } catch (e) {
          throw new BadRequestException('Invalid JSON format');
        }
      }
    }

    throw new BadRequestException('Invalid input format');
  }
}
