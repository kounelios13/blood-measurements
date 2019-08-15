import { Injectable } from "@angular/core";
import { TokenService } from "./token.service";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private _isLoggedIn = new BehaviorSubject(false);
  private _isLoggedIn$ = this._isLoggedIn.asObservable();
  private _jwt: String;
  // Define which keys should be cleared upon logout
  private appKeys = ["accessToken", "refreshToken"];
  constructor(private tokenService: TokenService) {
    this.tokenService.getJwt().subscribe(value => {
      if (!value) {
        this._isLoggedIn.next(false);
      } else if (this.isTokenExpired(value)) {
        this._isLoggedIn.next(false);
      } else {
        this._isLoggedIn.next(true);
      }
    });
  }

  public isLoggedIn(): Observable<boolean> {
    return this._isLoggedIn$;
  }

  private isTokenExpired(token) {
    if (!token) {
      return false;
    }
    const parts = token.split(".");
    const payload = JSON.parse(atob(parts[1]));
    // Check if token is expired
    const isExpired = Date.now() > payload.exp * 1000;
    return isExpired;
  }

  logoutUser() {
    this.tokenService.updateJwt("");
    this.appKeys.forEach(key => localStorage.removeItem(key));
  }
}
