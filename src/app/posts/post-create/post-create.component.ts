import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, NgForm,Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { PostsService } from "../posts.service";
import {mimeType} from './mime-type.validator';

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})

export class PostCreateComponent implements OnInit {
  enteredTitle = "";
  enteredContent = "";
  isLoading=false;
  post:Post;
  form:FormGroup;
  private mode='create';
  private postId:string;
  imagePreview:string;
  
  

  constructor(public postsService: PostsService,public route:ActivatedRoute) {}

ngOnInit(){
   this.form=new FormGroup({
   title:new FormControl(null,{validators:[Validators.required,Validators.minLength(3)]}),
   content:new FormControl(null,{validators:[Validators.required]}),
   image:new FormControl(null,{validators:[Validators.required],asyncValidators:[mimeType]})
   })

  this.route.paramMap.subscribe((paramMap:ParamMap)=>{
  if(paramMap.has('postId')){
  this.mode='edit';
  this.postId=paramMap.get('postId');
  //  this.isLoading=true;
   this.postsService.getPost(this.postId).subscribe(postData=>{
    //  this.isLoading=false;
     this.post={
       id:postData._id,
       title:postData.title,
       content:postData.content,
       imagePath:postData.imagePath
      };
      
      this.form.setValue({
        title:this.post.title,
        content:this.post.content,
        imagePath:this.post.imagePath
      });
   })
}
else{
  this.mode='create';
  this.postId=null;
  
}
    })
  }

onImagePicked(event:Event){
const file=(event.target as HTMLInputElement).files[0];
this.form.patchValue({image:file});
this.form.get('image').updateValueAndValidity();
console.log(file);
console.log(this.form);
const reader=new FileReader();
reader.onload=()=>{
this.imagePreview=reader.result as string;
}
reader.readAsDataURL(file);

  }


  onSavePost() {
    // if (this.form.invalid) {return;}

    this.isLoading=true;
    if(this.mode==="create"){
      this.postsService.
    addPost(
      this.form.value.title, 
      this.form.value.content,
      this.form.value.image
      );
    }
  else{
    this.postsService.updatePost(
      this.postId,
      this.form.value.title,
       this.form.value.content,
       this.form.value.image
       )
    }
   
    this.form.reset();
  }
  
}