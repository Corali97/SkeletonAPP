import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { ApiPost } from './app-data.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  readonly apiURL = 'https://jsonplaceholder.typicode.com';

  readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };

  constructor(private readonly http: HttpClient) {}

  getPosts(): Observable<ApiPost[]> {
    return this.http.get<ApiPost[]>(`${this.apiURL}/posts`).pipe(
      retry(3),
      catchError((error) => this.handleError(error))
    );
  }

  getPost(id: number): Observable<ApiPost> {
    return this.http.get<ApiPost>(`${this.apiURL}/posts/${id}`).pipe(
      retry(3),
      catchError((error) => this.handleError(error))
    );
  }

  createPost(post: ApiPost): Observable<ApiPost> {
    return this.http.post<ApiPost>(`${this.apiURL}/posts`, post, this.httpOptions).pipe(
      retry(3),
      catchError((error) => this.handleError(error))
    );
  }

  updatePost(id: number, post: ApiPost): Observable<ApiPost> {
    return this.http.put<ApiPost>(`${this.apiURL}/posts/${id}`, post, this.httpOptions).pipe(
      retry(3),
      catchError((error) => this.handleError(error))
    );
  }

  deletePost(id: number): Observable<unknown> {
    return this.http.delete(`${this.apiURL}/posts/${id}`, this.httpOptions).pipe(
      retry(3),
      catchError((error) => this.handleError(error))
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const message = error.error instanceof ErrorEvent
      ? error.error.message
      : `Error ${error.status}: ${error.message}`;

    return throwError(() => new Error(message));
  }
}
