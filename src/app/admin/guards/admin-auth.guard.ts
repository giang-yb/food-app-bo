import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { SupabaseService } from '../../core/services/supabase.service';

export const adminAuthGuard: CanActivateFn = async () => {
  const supabase = inject(SupabaseService);
  const router = inject(Router);

  const user = await supabase.getCurrentUser();
  if (!user) {
    router.navigate(['/admin/login']);
    return false;
  }

  return true;
};