import { ReadUsersDto } from "./read-users.dto";


export class ListUsersDto {
  data: ReadUsersDto[];
  total: number;
}