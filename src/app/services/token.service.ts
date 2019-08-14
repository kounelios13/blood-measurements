import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class TokenService {
  private jwt: BehaviorSubject<String> = new BehaviorSubject("");
  private refreshToken: BehaviorSubject<String> = new BehaviorSubject("");
  private jwt$: Observable<String> = this.jwt.asObservable();
  private refreshToken$: Observable<String> = this.refreshToken.asObservable();
  private loggedIn = false;
  constructor() {
    // Need to check if we have stored any token in local storage
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    this.jwt.next(accessToken);
    this.refreshToken.next(refreshToken);
  }

  getJwt(): Observable<String> {
    return this.jwt$;
  }

  updateJwt(jwt: string) {
    console.log("updating jwt", jwt);
    this.jwt.next(jwt);
    localStorage.setItem("accessToken", jwt);
  }

  getRefreshToken(): Observable<String> {
    return this.refreshToken$;
  }

  updateRefreshToken(refreshToken: string) {
    this.refreshToken.next(refreshToken);
    localStorage.setItem("refreshToken", refreshToken);
  }
}
