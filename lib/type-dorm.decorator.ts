import { Inject } from '@nestjs/common';
import { getTypeDormConnectionToken } from './type-dorm.util';

export const InjectTypeDorm = (name?: string) => {
  return Inject(getTypeDormConnectionToken(name));
};
