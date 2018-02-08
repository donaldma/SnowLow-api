'use strict'

import * as uuid from 'uuid'
import UserService from '../services/UserService'
import RequestValidation from '../utilities/RequestValidation'
import UserRepository from '../repositories/UserRepository'

/**
 * Register a new user
 */
module.exports.register = async (event, context, callback) => {
  const data = JSON.parse(event.body)

  const validation = await RequestValidation.validateUserRegistration(data)

  if (validation) {
    console.error('Validation Failed')
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: `Error message: ${validation}`
    })
    return
  }

  const request = {
    tableName: process.env.USER_TABLE!,
    id: uuid.v4(),
    email: data.email,
    password: data.password,
    name: data.name,
    location: data.location,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  await UserService.registerEmail(request, event, callback)
}

/**
 * Get a user by id
 */
module.exports.get = async (event, context, callback) => {
  await UserRepository.findById(process.env.USER_TABLE!, event, callback)
}

/**
 * Get all users
 */
module.exports.getAll = async (event, context, callback) => {
  await UserRepository.findAll(process.env.USER_TABLE!, event, callback, false)
}

/**
 * Update a user by id
 */
module.exports.update = async (event, context, callback) => {
  await UserRepository.update(process.env.USER_TABLE!, event, callback)
}

/**
 * Delete a user by id
 */
module.exports.delete = async (event, context, callback) => {
  await UserRepository.delete(process.env.USER_TABLE!, event, callback)
}

/**
 * Delete all
 */
module.exports.deleteAll = async (event, context, callback) => {
  await UserRepository.deleteAll(process.env.USER_TABLE!, event, callback)
}