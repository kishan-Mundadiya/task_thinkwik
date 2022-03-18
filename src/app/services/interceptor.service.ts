import { Injectable } from "@angular/core";
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, tap } from "rxjs/operators";

import { GlobalService } from "../services/global.service";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
const nonAuthUrls = ["signin",'signup'];

@Injectable({
  providedIn: "root",
})
export class InterceptorService {
  baseURL = "http://localhost:3000/";

  constructor(public Global: GlobalService, public router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    //do whatever you want with the HttpRequest

    if (!nonAuthUrls.includes(req.url)) {
      let token = this.Global.getLocalStorage({ key: "token" });
      if (token) {
        req = req.clone({ headers: req.headers.set("Authorization", token) });
      } else {
        this.Global.logout()
      }
    }
    if(req.body instanceof FormData == false){
      console.log("====>>>interceptor======");
      
      req = req.clone({
        headers: req.headers.set("Content-Type", "application/json"),
      });

    }
    // }
    req = req.clone({ url: this.baseURL + req.url });
    console.log("----------Headers", req.headers);

    return next.handle(req).pipe(
      map((res) => {
        return res;
      }),
      catchError((err: HttpErrorResponse) => {
        if (err.status == 401) {
          //unauthorized
          this.router.navigate(["sign-in"]);
        }
        return throwError(err);
      })
    );
  }
}
