import {createAsyncThunk} from '@reduxjs/toolkit'
import {AxiosError} from 'axios'

import {api} from '../../app/api'

import type {IdPayload} from '../../app/types'
import type {User} from '../auth/types'
import type {AddContactPayload, CheckUsernamePayload} from './types'

const getUser = createAsyncThunk<User | null, IdPayload>(
  'users/getUser',
  async (arg, thunkApi) => {
    try {
      const res = await api.get<User | null>(`/users/${arg.id}`)

      return res.data
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkApi.rejectWithValue(
          error.response?.data?.message || 'Unknown error'
        )
      }

      return thunkApi.rejectWithValue('Get user error')
    }
  }
)

const checkUsername = createAsyncThunk<boolean, CheckUsernamePayload>(
  'users/checkUsername',
  async (arg, thunkApi) => {
    try {
      const res = await api.post<boolean>(`/users/checkUsername`, arg)
      return res.data
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkApi.rejectWithValue(
          error.response?.data?.message || 'Unknown error'
        )
      }

      return thunkApi.rejectWithValue('[users/checkUsername] error')
    }
  }
)

const addContact = createAsyncThunk<User, AddContactPayload>(
  'contacts/addContact',
  async (arg, thunkApi) => {
    try {
      const res = await api.post<User>('/contacts', arg)

      return res.data
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkApi.rejectWithValue(
          error.response?.data?.message || 'Unknown error'
        )
      }

      return thunkApi.rejectWithValue('[contacts/addContact] error')
    }
  }
)

const getContacts = createAsyncThunk<User[]>(
  'contacts/getContacts',
  async (_, thunkApi) => {
    try {
      const rest = await api.get<User[]>('/contacts')
      return rest.data
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkApi.rejectWithValue(
          error.response?.data?.message || 'Unknown error'
        )
      }

      return thunkApi.rejectWithValue('[contacts/getContacts] error')
    }
  }
)

export const usersThunks = {getUser, checkUsername, addContact, getContacts}
