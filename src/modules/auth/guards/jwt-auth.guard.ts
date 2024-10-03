import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import JwtUtil from '../utils/jwt.util';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        return this.isExpired(context) && super.canActivate(context);
    }

    isExpired(context: ExecutionContext): boolean {
        try {
            const request = context.switchToHttp().getRequest();
            const token = request.headers.authorization?.split(' ')[1];
            JwtUtil.verifyToken(token);
            return true;
        } catch (error) {
            return false;
        }
    }

    handleRequest(err, user) {
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        return user;
    }
}
