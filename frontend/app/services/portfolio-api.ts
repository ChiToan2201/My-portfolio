import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable, inject} from '@angular/core';
import {Observable, map} from 'rxjs';
import {
  ApiEnvelope,
  ApiInspectionResult,
  ArchitectureBlueprint,
  ContactRequestPayload,
  ContactResponseRecord,
  DeveloperProfile,
  ProjectCaseStudy,
  ProjectFilter,
  SkillFilter,
  SkillGroup,
} from '../models/portfolio.types';

@Injectable({
  providedIn: 'root',
})
export class PortfolioApi {
  private readonly http = inject(HttpClient);

  getProfile(): Observable<DeveloperProfile> {
    return this.http
      .get<ApiEnvelope<DeveloperProfile>>('/api/profile')
      .pipe(map((res) => res.data));
  }

  getSkills(category: SkillFilter = 'all'): Observable<SkillGroup[]> {
    let params = new HttpParams();
    if (category !== 'all') {
      params = params.set('category', category);
    }
    return this.http
      .get<ApiEnvelope<SkillGroup[]>>('/api/skills', {params})
      .pipe(map((res) => res.data));
  }

  getProjects(category: ProjectFilter = 'all'): Observable<ProjectCaseStudy[]> {
    let params = new HttpParams();
    if (category !== 'all') {
      params = params.set('category', category);
    }
    return this.http
      .get<ApiEnvelope<ProjectCaseStudy[]>>('/api/projects', {params})
      .pipe(map((res) => res.data));
  }

  getArchitecture(): Observable<{
    blueprint: ArchitectureBlueprint;
    receivedContactsCount: number;
  }> {
    return this.http
      .get<ApiEnvelope<ArchitectureBlueprint>>('/api/architecture')
      .pipe(
        map((res) => ({
          blueprint: res.data,
          receivedContactsCount: res.receivedContactsCount ?? 0,
        })),
      );
  }

  submitContact(
    payload: ContactRequestPayload,
  ): Observable<{message: string; record: ContactResponseRecord}> {
    return this.http
      .post<ApiEnvelope<ContactResponseRecord>>('/api/contact', payload)
      .pipe(
        map((res) => ({
          message: res.message ?? 'Tin nhắn đã được ghi nhận thành công.',
          record: res.data,
        })),
      );
  }

  inspectEndpoint(endpointPath: string): Observable<ApiInspectionResult> {
    const startedAt = performance.now();
    return this.http
      .get<unknown>(endpointPath, {observe: 'response'})
      .pipe(
        map((response) => {
          const clientDurationMs = Math.max(
            1,
            Math.round((performance.now() - startedAt) * 10) / 10,
          );
          const serverDurationMs =
            response.headers.get('X-Response-Time-Ms') ?? `${clientDurationMs}`;
          const payloadPreview = JSON.stringify(response.body, null, 2);

          return {
            endpoint: endpointPath,
            method: 'GET',
            status: response.status,
            clientDurationMs,
            serverDurationMs,
            payloadPreview,
          };
        }),
      );
  }
}
