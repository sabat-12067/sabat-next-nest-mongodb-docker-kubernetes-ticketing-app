import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import { Observable, TimeoutError, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(5000), // Set your desired timeout duration here (in milliseconds)
      catchError((error) => {
        if (error instanceof TimeoutError) {
          return throwError(
            () => new RequestTimeoutException('Request timed out')
          );
        }
        return throwError(() => error);
      })
    );
  }
}
