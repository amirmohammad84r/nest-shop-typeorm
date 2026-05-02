import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LogsService } from './logs.service';
import { LogModel } from './logModel';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logService: LogsService) { }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const now = Date.now();
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.originalUrl || req.url;
    const ip =
      req.headers['x-forwarded-for'] ||
      req.socket?.remoteAddress ||
      req.ip;
    return next.handle().pipe(
      tap(async (res) => {

        const duration = Date.now() - now;
        let log: LogModel
        if (req.user) {
          if (req.changes) {
            log = {
              ip: ip,
              type: method,
              userid: req.user.id,
              module: url,
              updatedFields: req.changes,
              discription: `request ${method} to ${url}`,
            }
            if (process.env.NODE_ENV !== 'test') {
              await this.logService.createLog(log)
            }
          } else {
            log = {
              ip: ip,
              type: method,
              userid: req.user.id,
              module: url,
              discription: `request ${method} to ${url}`,
            }
            if (process.env.NODE_ENV !== 'test') {
              await this.logService.createLog(log)
            }
          }
          console.log(url)
        }
      }),
    );
  }
}
