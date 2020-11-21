import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls:['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy{
userIsAuthenticated=false;
private authListenerSubs:Subscription;

constructor(private authService:AuthService){}


ngOnInit(){
   this.userIsAuthenticated=this.authService.getIsAuth();
   this.authListenerSubs=this.authService.getAuthStatusListener().subscribe( isAuthantenticaated=>{
   this.userIsAuthenticated=isAuthantenticaated;
})
}

ngOnDestroy(){
this.authListenerSubs.unsubscribe();

}

onLogout(){
  this.authService.logout();
}

}
