import { Injectable } from '@nestjs/common';
import { Connection } from '@typedorm/core';

@Injectable()
export class TypeDormConnection extends Connection {}
