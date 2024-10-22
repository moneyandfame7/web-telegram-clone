import {
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit'
import {persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import {type RootState} from '../../app/store'

import type {User} from '../auth/types'
import {usersThunks} from './api'

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

const usersAdapterSelectors = usersAdapter.getSelectors<RootState>(
  (state) => state.users
)
const selectContacts = createSelector(
  [
    (state: RootState) => state.users.contactIds,
    (state: RootState) => state.users.entities,
  ],
  (contactIds, users) => {
    return contactIds.map((id) => users[id])
  }
)

const selectCurrentUser = createSelector(
  [
    (state: RootState) => state.auth.session?.userId,
    (state: RootState) => state,
  ],
  (currentUserId, state) => {
    if (!currentUserId) {
      return
    }
    return usersAdapterSelectors.selectById(state, currentUserId)
  }
)
export const usersSelectors = {
  ...usersAdapterSelectors,
  ...usersSlice.selectors,
  selectContacts,
  selectCurrentUser,
}

export const usersActions = usersSlice.actions
export const persistedUsersReducer = persistReducer(
  {
    key: 'users',
    storage: storage,
  },
  usersSlice.reducer
)
