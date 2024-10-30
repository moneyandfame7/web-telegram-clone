import {useAppDispatch, useAppSelector} from '../../../app/store'
import {usersThunks} from '../api'

export const useGetCurrentUser = () => {
  const id = useAppSelector((state) => state.auth.session?.userId)
  const dispatch = useAppDispatch()

  return async () => {
    if (id) {
      return dispatch(usersThunks.getUser({id})).unwrap()
    }
  }
}
