import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { LoginResponse } from "../interfaces/login-response";

@Injectable({
  providedIn: "root"
})
export class UserService {
  constructor(private http: HttpClient) {}

  login(email: string, password) {
    console.log("service fn method login");
    const url = this.generateBaseUrl() + "/login";
    return this.http.post<LoginResponse>(url, { email, password }).toPromise();
  }
  logoutUser() {
    const base = this.generateBaseUrl();
    const url = `${base}/token/reject`;
    return this.http.post(url, {}, { responseType: "text" }).toPromise();
  }
  register(email: string, password: string, passwordConfirm: string) {
    let url = this.generateBaseUrl() + "/register";
    return this.http
      .post(url, { email, password, passwordConfirm })
      .toPromise();
  }

  getProfile() {
    const url = this.generateBaseUrl() + "/profile";
    return this.http.get(url).toPromise();
  }
  private generateBaseUrl(): string {
    let url = `${environment.protocol}://${environment.url}:${
      environment.port
    }`;
    if (environment.basePath) {
      url = `${url}/${environment.basePath}`;
    }
    return url;
  }
}
