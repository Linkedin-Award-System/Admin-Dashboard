import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Project } from '../../state/project/project.actions';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(private http: HttpClient) {}

  getProjects(workspaceId: string): Observable<Project[]> {
    return this.http.get<Project[]>(`${environment.apiUrl}/workspaces/${workspaceId}/projects`);
  }

  createProject(workspaceId: string, name: string, description: string): Observable<Project> {
    return this.http.post<Project>(`${environment.apiUrl}/workspaces/${workspaceId}/projects`, { name, description });
  }

  updateProject(id: string, project: Partial<Project>): Observable<Project> {
    return this.http.put<Project>(`${environment.apiUrl}/projects/${id}`, project);
  }

  deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/projects/${id}`);
  }
}
