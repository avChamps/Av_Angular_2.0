import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { FaServiceService } from './fa-service.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  constructor(private faService: FaServiceService, private router: Router) {}

  canActivate(): boolean {
    if (this.faService.hasSession()) {
      return true;
    } else {
      this.router.navigate(['/home-page']);
      return false;
    }
}
  // logout() {
  //   this.faService.logout().subscribe(
  //     (response) => {
  //       console.log(response);
  //       localStorage.removeItem('jwtToken');
  //       this.router.navigate(['/home-page']);
  //     },(error) => {
  //       console.error(error); 
  //     }
  //   );
  // }
  
}