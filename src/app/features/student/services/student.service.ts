import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../common/services/api.service';
import { AddStudent, Student, UpdateStudent } from '../../../models/student/student.model';
import { environment } from '../../../../environments/environment.development';
import { Response } from '../../../models/common/response.model';


@Injectable({
  providedIn: 'root'
})

export class StudentService {

  private api = inject(ApiService);
  private baseUrl = environment.apiBaseUrl+'/Student'; 

  
  getAllStudents(): Observable<Response<Student[]>> {
    return this.api.get<Response<Student[]>>(this.baseUrl);
  }

 
  getStudentById(studentId: string): Observable<Response<Student>> {
    return this.api.get<Response<Student>>(`${this.baseUrl}/${studentId}`);
  }

  
  addStudent(dto: AddStudent): Observable<Response<boolean>> {
    return this.api.post<Response<boolean>>(this.baseUrl, dto);
  }

  
  updateStudent(dto: UpdateStudent): Observable<Response<Student>> {
    return this.api.put<Response<Student>>(this.baseUrl, dto);
  }

  
  deleteStudent(studentId: string): Observable<Response<boolean>> {
    return this.api.delete<Response<boolean>>(`${this.baseUrl}?id=${studentId}`);
  }

  
  addStudentWithFiles(formData: FormData): Observable<Response<boolean>> {
    return this.api.postForm<Response<boolean>>(this.baseUrl, formData);
  }
}
