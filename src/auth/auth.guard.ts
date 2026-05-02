import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY, ROLES_KEY, PERMISSION_KEY } from './decorators';
import { UserRepository } from 'src/user/repositories/userRepository';
import * as jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly userRepository: UserRepository) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization as string | undefined;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid Authorization header',
      );
    }

    const token = authHeader.slice(7);

    try {

      const payload = jwt.verify(token, JWT_SECRET) as {
        sub: string;
        role: string;
        email?: string;
        name?: string;
      };

      request.user = {
        id: payload.sub,
        role: payload.role,
        email: payload.email,
        name: payload.name,
      };

    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }







    // const requiredPermition = this.reflector.getAllAndOverride<string[]>(
    //   PERMISSION_KEY,
    //   [context.getHandler(), context.getClass()],
    // );


    // const takedRoleFromUser = await this.userRepository.findOne({ where: { id: request.user.sub }, relations: ['role'] })

    // const userRole = takedRoleFromUser?.role.title
    // if (userRole == roles.ADMIN) return true;
    // if (!userRole) {
    //   throw new UnauthorizedException('User role not provided');
    // }

    // const requiredRoles = this.reflector.getAllAndOverride<string[]>(
    //   ROLES_KEY,
    //   [context.getHandler(), context.getClass()],
    // );

    // if (!requiredRoles || requiredRoles.length === 0) {
    //   throw new ForbiddenException('Insufficient role1');
    // }

    // if (!requiredRoles.includes(userRole)) {
    //   throw new ForbiddenException('Insufficient role2');
    // }

    // const userPermitions = takedRoleFromUser?.role.permitions

    // if (!requiredPermition || requiredPermition.length === 0) {
    //   throw new ForbiddenException('InInsufficient permitionnn');
    // }
    // const userPermitionsTitles = userPermitions?.map(a => a.title)
    // if (userPermitionsTitles?.indexOf(requiredPermition[0]) === -1) throw new ForbiddenException('Insufficient permition');
    return true;
  }

}



