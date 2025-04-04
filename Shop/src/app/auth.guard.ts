import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const allowedRoles = route.data['roles'] as string[];
  const userRole = authService.getRole();
  const isLoggedIn = authService.isLoggedIn();
  const isLoginPage = state.url.startsWith('/login'); // Check if the URL starts with /login

  if (isLoggedIn) {
    if (isLoginPage) {
      router.navigate(['/profile']);
      return false;
    }
    if (!allowedRoles || (userRole && allowedRoles.includes(userRole))) {
      return true;
    } else {
      router.navigate(['/login']);
      return false;
    }
  }

  if (!isLoginPage) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  return true;
};