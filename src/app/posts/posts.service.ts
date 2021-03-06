import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Subject } from 'rxjs';
import { Post } from './post.model';
import {map} from 'rxjs/operators'
import { Router } from '@angular/router';
import {environment} from '../../environments/environment';
import { AuthService } from '../auth/auth.service';


const BACKEND_URL=environment.apiUrl+"/posts";

@Injectable({providedIn: 'root'})

export class PostsService {
  private posts: Post[] = [];

  private postsUpdated = new Subject<{posts:Post[],postCount:number}>();

constructor(private http:HttpClient,private router:Router,private authService:AuthService){}

  getPosts(postsPerPage:number,currentPage:number) {

    const queryParams=`?pagesize=${postsPerPage}&page=${currentPage}`;
   this.http.get<{message:string,posts:any,maxPosts:number}>(BACKEND_URL+queryParams)
   .pipe(map((postData)=>{
     return{posts:postData.posts.map(post=>{
     return{ 
        title:post.title,
       content:post.content,
       id:post._id,
       imagePath:post.imagePath,
       creator:post.creator
      }
     }),
     maxPosts:postData.maxPosts
    };
    
     }))

.subscribe(transformedPostData=>{
  // console.log(transformedPostData);
     this.posts=transformedPostData.posts;
    this.postsUpdated.next({
      posts:[...this.posts],
      postCount:transformedPostData.maxPosts
    })
   })
  }

getPost(id:string){
  return this.http.get<{
    _id:string;
    title:string;
    content:string;
    imagePath:string;
    creator:string;
  }>(BACKEND_URL+"/"+id);
}

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string,image:File) {
   const postData= new FormData();
   postData.append('title',title);
   postData.append('content',content);
   postData.append('image',image,title);
    this.http.post<{message:string,post:Post}>(BACKEND_URL,postData)
    .subscribe((responseData)=>{
      //console.log(responseData.message);
      const post:Post={
        id:responseData.post.id,
        title:title,
        content:content,
      imagePath:responseData.post.imagePath,
      creator:null
      }
      this.router.navigate(["./photos"])
    }

    );
   
  }


// download post 
downloadPost(filename:string){

 // getting image name from url
  const url =filename
  const imageName= url.substring(url.lastIndexOf('/') + 1);
   return this.http.get("http://localhost:3000/api/posts/file/"+imageName,{
     responseType:'blob',
     headers:new HttpHeaders().append('content-Type','application/json')
    }
   )
}

//  delete request
deletePost(postId:string){
 return this.http.delete(BACKEND_URL+"/"+postId)
}

updatePost(id:string,title:string,content:string,image: File | string){
let postData: Post | FormData;
if(typeof image === "object"){
 postData= new FormData();
 postData.append("id",id);
 postData.append("title",title);
 postData.append("content",content);
 postData.append("image",image,title);
}
else{
   postData={
     id:id,
    title:title,
    content:content,
    imagePath:image,
    creator:null
  };
}
this.http.put(BACKEND_URL+"/"+id,postData).subscribe((response)=>{

this.router.navigate(["./"])

})
}
}
