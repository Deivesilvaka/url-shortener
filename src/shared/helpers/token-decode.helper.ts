import { UnauthorizedException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
ConfigModule.forRoot();

export function decodeJwtFromRequest(req: Request) {
  const authorizationHeader = req.headers['authorization'];

  if (!authorizationHeader) {
    return null;
  }

  const [bearer, token] = authorizationHeader.split(' ');
  bearer;

  try {
    const secretKey = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    throw new UnauthorizedException();
  }
}
