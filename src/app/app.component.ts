import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { PostsService } from './posts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loadedPosts = [];
  isFetching = false;
  error = null;
  errorStatus = null;

  constructor(private http: HttpClient, private postsService: PostsService) { }

  ngOnInit() {
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
        this.error = error.message;
        this.errorStatus = error.status;
        console.log(error)
      });
  };
};
