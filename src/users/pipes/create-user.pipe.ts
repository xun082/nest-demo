import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class CreateUserPipe implements PipeTransform {
  transform(value: CreateUserDto, metadata: ArgumentMetadata) {
    console.log(value);
    if (value.roles && value.roles instanceof Array && value.roles.length > 0) {
      if (value.roles[0]['id']) {
        value.roles = value.roles.map((role: any) => role.id);
      }
    }
    console.log(value);
    return value;
  }
}
