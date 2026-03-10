import { createReducer, on } from '@ngrx/store';
import { User } from '../../core/services/auth.service';
import { AuthActions } from './auth.actions';

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.login, (state) => ({ ...state, isLoading: true, error: null })),
  on(AuthActions.loginSuccess, (state, { user }) => ({ ...state, user, isLoading: false })),
  on(AuthActions.loginFailure, (state, { error }) => ({ ...state, error, isLoading: false })),
  
  on(AuthActions.register, (state) => ({ ...state, isLoading: true, error: null })),
  on(AuthActions.registerSuccess, (state, { user }) => ({ ...state, user, isLoading: false })),
  on(AuthActions.registerFailure, (state, { error }) => ({ ...state, error, isLoading: false })),
  
  on(AuthActions.setUser, (state, { user }) => ({ ...state, user })),
  on(AuthActions.logout, () => initialState)
);
