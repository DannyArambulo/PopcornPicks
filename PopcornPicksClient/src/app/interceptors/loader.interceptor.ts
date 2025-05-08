import { HttpContextToken, HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { LoaderService } from '../loadingscreen/loader.service';

export const SkipLoading = new HttpContextToken<boolean>(() => false);

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};

@Injectable()
export class LoadingInterceptor 
    implements HttpInterceptor {
  constructor(private loadingService: LoaderService) {}  
  
  // Checks if any HTTPRequests are being made 
  // (I.E. if a new page loads, if data is being retrieved, etc.). If the requests
  // are being made, run the loading service. Otherwise, when done, stop the loading
  // service.
  intercept
  (
    req: HttpRequest<any>, 
    next: HttpHandler
  ): Observable<HttpEvent<any>> 
  {
    // console.log("Intercepting!!!");
    if(req.context.get(SkipLoading))
    {
      // console.log("Skiploading!!!")
      return next.handle(req);
    }

    this.loadingService.loadingStart();

    return next.handle(req).pipe
    (
      finalize(() => 
      {
        this.loadingService.loadingStop();
      })
    )
  }
}
