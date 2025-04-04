import { ApplicationConfig, inject, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Router, withNavigationErrorHandler } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient} from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),provideHttpClient( ),provideRouter(routes, withNavigationErrorHandler((error) => {
    // Your custom error handling logic here
    console.error('Navigation Error:', error);
    // Example: Redirect to an error page
    const router = inject(Router);
    router.navigate(['/error']); // Make sure you have an '/error' route
  })),
]
};
