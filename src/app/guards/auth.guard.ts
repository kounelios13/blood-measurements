import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from "@angular/router";

import { AuthService } from "../services/auth.service";
import { map, catchError } from "rxjs/operators";
import { of, Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.isLoggedIn().pipe(
      // sometimes  e is true even when logged out
      map(e => {
        console.log("mapping e", e);
        if (e) {
          return true;
        } else {
          this.router.navigate(["/login"]);
          return false;
        }
      }),
      catchError(err => {
        this.router.navigate(["/login"]);
        return of(false);
      })
    );
  }
}
