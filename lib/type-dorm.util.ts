import { TYPE_DORM_MODULE_NAME, TYPE_DORM_MODULE_OPTION_TOKEN, TYPE_DORM_MODULE_TOKEN } from './type-dorm.const';

export function getTypeDormConnectionToken(name?: string) {
  return `${ name ?? TYPE_DORM_MODULE_NAME }_${ TYPE_DORM_MODULE_TOKEN }`;
}

export function getTypeDormConnectionOptionToken(name?: string) {
  return `${ name ?? TYPE_DORM_MODULE_NAME }_${ TYPE_DORM_MODULE_OPTION_TOKEN }`;
}