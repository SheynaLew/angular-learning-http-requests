import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { PostsService } from './posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts = [];
  isFetching = false;
  error = null;
  errorStatus = null;
  private errorSub: Subscription;

  constructor(private http: HttpClient, private postsService: PostsService) { }

  ngOnInit() {

    this.errorSub = this.postsService.error.subscribe(errorMessage => {
      this.error = errorMessage
    });

    this.fetchAllPosts();
  };

  onCreatePost(postData: Post) {
    // Send Http request
    this.postsService.createAndStorePost(postData.title, postData.content);
  };

  onFetchPosts() {
    // Send Http request
    this.fetchAllPosts();
  };

  onClearPosts() {
    // Send Http request
    this.postsService.deleteAllPosts().subscribe(() => {
      this.loadedPosts = [];
    })
  };

  private fetchAllPosts() {
    this.isFetching = true;
    this.postsService.fetchPosts().subscribe(
      posts => {
        this.isFetching = false;
        this.loadedPosts = posts;
      },
      error => {
        this.isFetching = false;
        this.error = error.message;
        this.errorStatus = error.status;
        console.log(error)
      });
  };

  onHandleError() {
    this.error = null;
  }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }
};
