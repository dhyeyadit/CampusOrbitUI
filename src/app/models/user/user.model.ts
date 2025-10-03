import { Role } from "../role/role.model";

export interface User {
  fullName: string;
  enrollmentNumber:string;
  roles: Role[];
}
