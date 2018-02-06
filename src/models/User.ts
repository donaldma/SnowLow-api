export interface ICreateUserRequest {
  email: string
  password: string
  name: string
  location: string
}

export interface ICreateUserParams {
  TableName: string
  Item: {
    id: string
    email: string
    password: string
    name: string
    location: string
  }
}