import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

function formatDateOnly(date: Date | string): string {
  if (!date) return '';
  if (typeof date === 'string') return date.substring(0, 10);
  return date.toISOString().substring(0, 10);
}

function transformDates(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(transformDates);
  } else if (obj && typeof obj === 'object') {
    const result = {};
    for (const key in obj) {
      if (
        obj[key] instanceof Date ||
        (typeof obj[key] === 'string' && /^\d{4}-\d{2}-\d{2}/.test(obj[key]))
      ) {
        result[key] = formatDateOnly(obj[key]);
      } else {
        result[key] = transformDates(obj[key]);
      }
    }
    return result;
  }
  return obj;
}

@Injectable()
export class DateOnlyInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => transformDates(data)));
  }
}
