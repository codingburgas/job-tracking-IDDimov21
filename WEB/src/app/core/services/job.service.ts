import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JobPosting, CreateJobRequest, UpdateJobRequest } from '../models/job.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  constructor(private http: HttpClient) {}

  getJobs(): Observable<JobPosting[]> {
    return this.http.get<JobPosting[]>(`${environment.apiUrl}/jobs`);
  }

  getJob(id: number): Observable<JobPosting> {
    return this.http.get<JobPosting>(`${environment.apiUrl}/jobs/${id}`);
  }

  createJob(job: CreateJobRequest): Observable<JobPosting> {
    return this.http.post<JobPosting>(`${environment.apiUrl}/jobs`, job);
  }

  updateJob(id: number, job: UpdateJobRequest): Observable<JobPosting> {
    return this.http.put<JobPosting>(`${environment.apiUrl}/jobs/${id}`, job);
  }

  deleteJob(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/jobs/${id}`);
  }
}