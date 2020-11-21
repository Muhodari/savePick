import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';

@Injectable({providedIn: 'root'})
export class AuthService{
private isAuthonticated=false;
 private   token:string;
 private tokenTimer:any;
  private  authStatusListener=new Subject<boolean>();
constructor(private http:HttpClient,private router:Router){}

getToken(){
    return this.token;
}

getIsAuth(){
    return this.isAuthonticated;
}

getAuthStatusListener(){
    return this.authStatusListener.asObservable();
}

 createUser(email:string,password:string){
const authData:AuthData={email:email,password:password}        
this.http.post('http://localhost:3000/api/user/signup',authData)
.subscribe(response=>{
console.log(response);
})
}


login(email:string,password:string){
const authData:AuthData={email:email,password:password}

this.http.post<{token:string,expiresIn:number}>('http://localhost:3000/api/user/login',authData)
.subscribe(response=>{

const token=response.token;
this.token=token;
if(token){
 const expiresInDuration=response.expiresIn;   
 
 this.tokenTimer=setTimeout(()=>{
     this.logout();
 }, expiresInDuration * 1000);

this.isAuthonticated=true;
this.authStatusListener.next(true);
this.router.navigate(['/']);
}
})        
}

logout(){
    this.token=null;
    this.isAuthonticated=false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.router.navigate(['/']);
    
}

}