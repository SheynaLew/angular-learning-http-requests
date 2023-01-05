import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, throwError } from "rxjs";
import { map, catchError } from 'rxjs/operators';
import { Post } from "./post.model";

@Injectable({ providedIn: 'root' })

export class PostsService {
  error = new Subject<string>();

  constructor(private http: HttpClient) { }

  createAndStorePost(title: string, content: string) {
    const postData: Post = { title: title, content: content }
    this.http
      .post<{ name: string }>(
        'https://ng-complete-guide-fe04b-default-rtdb.europe-west1.firebasedatabase.app/posts.json',
        postData
      ).subscribe(responseData => {
        console.log(responseData)
      },
        error => {
          this.error.next(error.message);
        });
  };

  fetchPosts() {
    return this.http
      .get<{ [key: string]: Post }>('https://ng-complete-guide-fe04b-default-rtdb.europe-west1.firebasedatabase.app/posts.json')
      // .pipe(map((responseData: { [key: string]: Post }) => {
      .pipe(map(responseData => {
        const postsArray: Post[] = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {

            postsArray.push({ ...responseData[key], id: key })
          };
        };
        return postsArray;
      }),
        catchError(errorRes => {
          return throwError(errorRes);
        })
      );
  };

  deleteAllPosts() {
    return this.http
      .delete('https://ng-complete-guide-fe04b-default-rtdb.europe-west1.firebasedatabase.app/posts.json')
  };
};
