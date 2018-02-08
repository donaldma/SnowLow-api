import * as bcrypt from 'bcrypt'
import * as createError from 'http-errors'
import UserRepository from '../repositories/UserRepository'

export default {

  // login: async function (email: string, password: string) {
  //   const user = await UserRepository.findByEmail(email)
  //   if (!user) {
  //     throw createError(401, 'Incorrect email or password')
  //   } else if (!user.password) {
  //     throw createError(401, 'This account was created via Facebook. Please log in with your original account creation method')
  //   } else if (!bcrypt.compareSync(password, user.password)) {
  //     throw createError(401, 'Incorrect email or password')
  //   } else {
  //     const authToken = await AuthTokenService.add(user.id)
  //     return {
  //       user: user.completeJSON(),
  //       token: authToken
  //     }
  //   }
  // },

  registerEmail: async function(params: any, event: any, callback: any) {
    try {
      const users = await UserRepository.findAll(params.tableName, event, callback, true)
      users!.forEach(user => {
        if(user.email === params.email) {
          throw createError(409)
        }
      })
    } catch(error) {
      callback(null, {
        statusCode: error.statusCode || 409,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Email ' + params.email + ' already exists'
      })
      return
    }


    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(params.password, salt)
    const createRequest = {
      id: params.id,
      email: params.email,
      password: hashedPassword,
      name: params.name,
      location: params.location,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt
    }

    const createdUser = await UserRepository.create(params.tableName, createRequest, callback)

    return createdUser
  }

}
