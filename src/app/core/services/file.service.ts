import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpRequest } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreatorFile } from '../../state/file/file.actions';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  constructor(private http: HttpClient) {}

  uploadFile(file: File, projectId: string, folderId?: string): Observable<number | CreatorFile> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('projectId', projectId);
    if (folderId) formData.append('folderId', folderId);

    const req = new HttpRequest('POST', `${environment.apiUrl}/files/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req).pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            return Math.round((100 * event.loaded) / (event.total || 1));
          case HttpEventType.Response:
            return event.body as CreatorFile;
          default:
            return 0;
        }
      })
    );
  }

  getFiles(projectId: string, folderId?: string): Observable<CreatorFile[]> {
    let url = `${environment.apiUrl}/projects/${projectId}/files`;
    if (folderId) url += `?folderId=${folderId}`;
    return this.http.get<CreatorFile[]>(url);
  }

  deleteFile(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/files/${id}`);
  }
}
