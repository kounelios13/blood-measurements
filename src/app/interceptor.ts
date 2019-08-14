import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpHeaders
} from "@angular/common/http";

import { Observable, throwError } from "rxjs";
import { map, catchError, tap } from "rxjs/operators";
import { UserService } from "./services/user.service";
import { TokenService } from "./services/token.service";
@Injectable()
export class Interceptor implements HttpInterceptor {
  private jwt: String;
  private refreshToken: String;
  constructor(
    private userService: UserService,
    private tokenService: TokenService
  ) {
    // Load jwt and refresh token from a shared  service
    this.tokenService.getJwt().subscribe(value => {
      this.jwt = value;
    });
    this.tokenService.getRefreshToken().subscribe(value => {
      this.refreshToken = value;
    });
  }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log(this.jwt);
    const headers = new HttpHeaders({
      Authorization: `${this.jwt}`,
      "Content-Type": "application/json"
    });
    const cloned = req.clone({
      headers,
      body: req.body
    });
    console.log(cloned);
    return next.handle(cloned).pipe(
      tap(async (e: any) => {
        if (e.status && [400, 401].includes(e.status)) {
          // Need to refresh the token
          // @TODO check if refresh fails.
          //If so the refresh token is expired and thus we should redirect user to login page
          const tokens: any = await this.userService.refreshToken(
            this.refreshToken
          );
          this.tokenService.updateJwt(tokens.accessToken);
          this.tokenService.updateRefreshToken(tokens.refreshToken);
          const headers = new HttpHeaders({
            Authorization: tokens.accessToken,
            "Content-Type": "application/json"
          });
          const cloned = req.clone({
            headers,
            body: req.body
          });
          return next.handle(cloned);
        }
      })
    );
  }
}
