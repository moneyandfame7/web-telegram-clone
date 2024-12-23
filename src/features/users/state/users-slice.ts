import {createEntityAdapter, createSlice} from '@reduxjs/toolkit'
import {persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import type {User} from '../../auth/types'
import {usersThunks} from '../api'

export const usersAdapter = createEntityAdapter<User, string>({
  selectId: (model) => model.id,
})

interface UsersState {
  contactIds: string[]
}

const usersSlice = createSlice({
  name: 'users',
  initialState: usersAdapter.getInitialState<UsersState>({
    contactIds: [],
  }),
  reducers: {
    addUser: usersAdapter.setOne,
  },
  extraReducers: (builder) => {
    builder.addCase(usersThunks.getUser.fulfilled, (state, action) => {
      const user = action.payload
      if (user) {
        usersAdapter.setOne(state, user)
        console.log(`User [${user.id}] was added to state`)
      }
    })

    builder.addCase(usersThunks.addContact.fulfilled, (state, action) => {
      const user = action.payload

      state.contactIds.push(user.id)
      usersAdapter.setOne(state, user)
      console.log(`User [${user.id}] was added to state`)
    })

    builder.addCase(usersThunks.getContacts.fulfilled, (state, action) => {
      const users = action.payload
      const userIds = users.map((u) => u.id)

      state.contactIds = Array.from(new Set([...state.contactIds, ...userIds]))
      usersAdapter.setMany(state, users)
    })
  },
})

export const usersActions = usersSlice.actions
export const persistedUsersReducer = persistReducer(
  {
    key: 'users',
    storage: storage,
  },
  usersSlice.reducer
)
