import { Measurement } from "./measurement";

export interface User {
  email: string;
  password: string;
  _id: string;
  name: string;
  surname: string;
  records: Measurement[];
}
