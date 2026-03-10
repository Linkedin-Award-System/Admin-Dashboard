import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from '../../core/services/auth.service';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Login': props<{ email: string; password: string }>(),
    'Login Success': props<{ user: User; token: string; refreshToken: string }>(),
    'Login Failure': props<{ error: string }>(),
    
    'Register': props<{ userData: any }>(),
    'Register Success': props<{ user: User; token: string; refreshToken: string }>(),
    'Register Failure': props<{ error: string }>(),
    
    'Logout': emptyProps(),
    'Logout Success': emptyProps(),
    
    'Load User From Storage': emptyProps(),
    'Set User': props<{ user: User }>(),
  }
});
