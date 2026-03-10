import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Workspace } from '../../state/workspace/workspace.actions';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {
  constructor(private http: HttpClient) {}

  getWorkspaces(): Observable<Workspace[]> {
    return this.http.get<Workspace[]>(`${environment.apiUrl}/workspaces`);
  }

  createWorkspace(name: string, description: string): Observable<Workspace> {
    return this.http.post<Workspace>(`${environment.apiUrl}/workspaces`, { name, description });
  }

  updateWorkspace(id: string, workspace: Partial<Workspace>): Observable<Workspace> {
    return this.http.put<Workspace>(`${environment.apiUrl}/workspaces/${id}`, workspace);
  }

  deleteWorkspace(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/workspaces/${id}`);
  }
}
