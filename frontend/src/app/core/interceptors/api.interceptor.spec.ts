import { HttpRequest, HttpHandlerFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { apiInterceptor } from './api.interceptor';

describe('apiInterceptor', () => {
  it('should add withCredentials to the request', () => {
    const req = new HttpRequest('GET', '/api/test');
    const next: HttpHandlerFn = (r) => {
      expect(r.withCredentials).toBe(true);
      return of(new HttpResponse({ status: 200 }));
    };

    apiInterceptor(req, next).subscribe();
  });

  it('should preserve the original request URL', () => {
    const req = new HttpRequest('GET', '/api/recipes');
    const next: HttpHandlerFn = (r) => {
      expect(r.url).toBe('/api/recipes');
      return of(new HttpResponse({ status: 200 }));
    };

    apiInterceptor(req, next).subscribe();
  });
});
