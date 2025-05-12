import { Role } from "./role";

export interface User {
    email: string;
    password: string;
    roles: Role[];
    storeName?: string; // Optional field for store name
  }
  