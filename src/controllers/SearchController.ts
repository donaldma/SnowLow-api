'use strict'

import UserRepository from '../repositories/UserRepository'
import SearchService from '../services/SearchService'

/**
 * Search based on search term
 */
module.exports.search = async (event, context, callback) => {
  await SearchService.scrapeBySearchTerm(event.pathParameters.searchTerm, process.env.USER_TABLE!, event, callback)
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