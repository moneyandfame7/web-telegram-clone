import {usersAdapter} from '../users-slice'

import type {RootState} from '../../../app/store'
import {createSelector} from '@reduxjs/toolkit'

const selectors = usersAdapter.getSelectors<RootState>((state) => state.users)

const selectCurrentUser = createSelector(
  (state: RootState) => state,
  (state: RootState) => state.auth.session?.userId,
  (state, currentUserId) => {
    if (!currentUserId) return null

    return selectors.selectById(state, currentUserId)
  }
)

export const usersSelectors = {selectCurrentUser}
