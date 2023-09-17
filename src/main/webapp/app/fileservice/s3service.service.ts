import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class S3serviceService {
  constructor(private http: HttpClient) {}

  uploadFile(formData: FormData): Observable<any> {
    return this.http.post('/api/v1/file/upload', formData);
  }

  getImage(fileName: string): Observable<Blob> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/octet-stream',
    });

    return this.http.get(`https://s3.eu-west-3.amazonaws.com/trokeur-bucket/${fileName}`, {
      responseType: 'blob',
      headers,
    });
  }
}
