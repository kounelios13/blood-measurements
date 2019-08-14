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
  private generateBaseUrl(): string {
    const url = `${environment.protocol}://${environment.url}:${
      environment.port
    }/${environment.basePath}`;
    return url;
  }
}
