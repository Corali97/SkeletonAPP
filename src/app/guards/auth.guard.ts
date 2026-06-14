import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { DBTaskService } from '../services/dbtask.service';

export const authGuard: CanActivateFn = () => {
  const dbTask = inject(DBTaskService);
  const router = inject(Router);

  dbTask.createTables();

  if (dbTask.hasActiveSession()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
