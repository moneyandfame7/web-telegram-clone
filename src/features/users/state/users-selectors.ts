import {createSelector} from '@reduxjs/toolkit'
import {RootState} from '../../../app/store'
import {usersAdapter} from './users-slice'

const baseSelectors = usersAdapter.getSelectors<RootState>(
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
    return baseSelectors.selectById(state, currentUserId)
  }
)
export const usersSelectors = {
  ...baseSelectors,
  selectContacts,
  selectCurrentUser,
}
