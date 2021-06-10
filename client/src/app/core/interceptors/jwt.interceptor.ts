import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()

//take care of sending back token for authorization
export class jwtInterCeptor implements HttpInterceptor{
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('token');
        if(token){
            request = request.clone({
                setHeaders:{
                    Authorization: `Bearer ${token}`
                }
            });
        }
        return next.handle(request);
    }

}