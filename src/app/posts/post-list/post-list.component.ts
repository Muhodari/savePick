import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { saveAs } from 'file-saver'
import { Post } from "../post.model";
import { PostsService } from "../posts.service";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {
  
  posts: Post[] = [];
  private postsSub: Subscription;
  isLoading=false;
  totalPosts=0;
  postsPerPage=25;
  pageSizeOptions=[1,2,5,10,20,30,100];
 currentPage=1;
 userIsAuthanticated=false;
 userId:string;
 private authStatusSubs:Subscription;

  constructor(public postsService: PostsService,private authService:AuthService) {}

  ngOnInit() {
    this.isLoading=true;
     this.postsService.getPosts(this.postsPerPage,this.currentPage);
     this.userId=this.authService.getUserId();
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postData:{posts:Post[],postCount:number}) => {
        this.isLoading=false;
        this.totalPosts=postData.postCount;
        this.posts =postData.posts;
      });
      
      this.userIsAuthanticated=this.authService.getIsAuth();
      this.authStatusSubs=this.authService.getAuthStatusListener()
      .subscribe(isAuthanticated=>{
        this.userIsAuthanticated=isAuthanticated;
        this.userId=this.authService.getUserId();
      });
  }


onDelete(postId:string){
  this.isLoading=true;
this.postsService.deletePost(postId).subscribe(()=>{
 this.postsService.getPosts(this.postsPerPage,this.currentPage);

},()=>{
  this.isLoading=false;
})
}


onDownload(filename:string){
  this.postsService.downloadPost(filename) .subscribe(post=>{
    saveAs(post,filename);
 },error=>{
   console.log(error);
 })
    }

  onChangedPage(pageData:PageEvent){
    this.isLoading=true;
    this.currentPage=pageData.pageIndex+1;
    this.postsPerPage=pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage,this.currentPage);
  //console.log(pageData);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSubs.unsubscribe();
  }


  

}
