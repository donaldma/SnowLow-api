import { ICreateUserRequest } from '../models/User'
import * as validator from 'validator'

export default {

  validateUserRegistration: function(request: ICreateUserRequest): string | undefined {
    if (!request.email || !request.password) {
      return 'Please enter your email and password'
    } else if (!request.name || request.name === '') {
      return 'Please provide your name'
    }

    request.email = request.email.trim()

    if(!validator.isEmail(request.email)) {
      return `Please enter a valid email address. Submitted: ${request.email}`
    } else if(request.password.length < 6) {
      return 'Your password must be at least 6 characters long'
    } else if(!request.location || request.location === '') {
      return 'Please provide your location'
    }

    return
  }
}