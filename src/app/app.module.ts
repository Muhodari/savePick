import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatInputModule, } from "@angular/material/input";
import { MatCardModule, } from "@angular/material/card";
import {  MatButtonModule,} from "@angular/material/button";
import {MatToolbarModule, } from "@angular/material/toolbar";
import {  MatExpansionModule} from "@angular/material/expansion";
import{MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import { AppComponent } from "./app.component";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { HeaderComponent } from "./header/header.component";
import { PostListComponent } from "./posts/post-list/post-list.component";
import {HttpClientModule} from '@angular/common/http';
import{MatPaginatorModule} from '@angular/material/paginator';

import {AppRoutingModule} from "./app-routing.module";
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';

@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent,
    HeaderComponent,
    PostListComponent,
    LoginComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    HttpClientModule,
    MatProgressSpinnerModule ,
    MatPaginatorModule  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}