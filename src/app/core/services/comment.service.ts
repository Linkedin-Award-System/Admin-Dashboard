import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Comment } from '../../state/comment/comment.actions';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  constructor(private http: HttpClient) {}

  getComments(fileId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${environment.apiUrl}/files/${fileId}/comments`);
  }

  addComment(fileId: string, content: string, type: 'text' | 'voice' = 'text', timestamp?: number, voiceUrl?: string): Observable<Comment> {
    return this.http.post<Comment>(`${environment.apiUrl}/files/${fileId}/comments`, {
      content,
      type,
      timestamp,
      voiceUrl
    });
  }

  deleteComment(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/comments/${id}`);
  }
}
