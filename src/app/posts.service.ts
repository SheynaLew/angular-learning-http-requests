import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, throwError } from "rxjs";
import { map, catchError, tap } from 'rxjs/operators';
import { Post } from "./post.model";

@Injectable({ providedIn: 'root' })

export class PostsService {
  error = new Subject<string>();

  constructor(private http: HttpClient) { }

  createAndStorePost(title: string, content: string) {
    const postData: Post = { title: title, content: content }
    console.log("postData", postData)
    this.http
      .post<{ name: string }>(
        'https://ng-complete-guide-fe04b-default-rtdb.europe-west1.firebasedatabase.app/posts.json',
        //  https://ng-complete-guide-fe04b-default-rtdb.europe-west1.firebasedatabase.app/posts.json
        postData,
        {
          observe: 'response',
          responseType: 'json'
          // app will break here if you use anything other than json
        }
      ).subscribe(responseData => {
        console.log("response data (response)", responseData);
        console.log("body", responseData.body)
      },
        error => {
          this.error.next(error.message);
        });
  };

  fetchPosts() {
    let searchParams = new HttpParams();
    searchParams = searchParams.append('print', 'pretty');
    searchParams = searchParams.append('key', 'value');
    return this.http
      .get<{ [key: string]: Post }>(
        'https://ng-complete-guide-fe04b-default-rtdb.europe-west1.firebasedatabase.app/posts.json',
        {
          headers: new HttpHeaders({
            "Custom-Header": "Hello"
          }),
          params: searchParams
        })
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
      .delete('https://ng-complete-guide-fe04b-default-rtdb.europe-west1.firebasedatabase.app/posts.json',
        {
          observe: 'events',
          responseType: 'text'
        }).pipe(tap(event => {
          console.log("event", event);
          if (event.type === HttpEventType.Sent) {
            console.log("request sent")
          }
          if (event.type === HttpEventType.Response)
            console.log("type of event", event.type)
        }));

  };
};
