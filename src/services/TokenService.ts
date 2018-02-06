import * as jwt from 'jsonwebtoken'
import * as randomString from 'randomstring'
import { IToken } from '../models/Token'

export class TokenService {

  static sign(payload: IToken): string {
    payload.createdAt = new Date().toISOString()    
    return jwt.sign(payload, process.env.JWT_SECRET)
  }

  static verify<T extends IToken>(token: string): T {
    return jwt.verify(token, process.env.JWT_SECRET)
  }

  static randomString() {
    return randomString.generate({
      length: 24,
      charset: 'alphanumeric'
    })
  }

}