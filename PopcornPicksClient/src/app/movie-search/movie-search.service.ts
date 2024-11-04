import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs'; 

@Injectable({
  providedIn: 'root'
})
export class MovieSearchService {
  private apiUrl = 'http://127.0.0.1:5000'

  constructor(private http: HttpClient) { }

  searchMovies(query: string): Observable<any> {
    const params = new HttpParams().set('query', query);
    return this.http.get<any>(this.apiUrl, { params });
  }
}
