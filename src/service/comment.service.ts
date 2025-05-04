import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { ApiResponse } from '../reponses/api.response';
import { TokenService } from './token.service';
import { Router } from '@angular/router';


@Injectable({
    providedIn: 'root'
})
export class CommentService {
    private apiUrl = `${environment.apiBaseUrl}/comments`;

    constructor(
        private http: HttpClient,
        private tokenService: TokenService,
        private router: Router,
    ) { }

    private getHeaders(): HttpHeaders {
        const token = this.tokenService.getToken();
        if (!token) {
            this.router.navigate(['/login']); // Redirect if no token
            throw new Error('No token available');
        }
        return new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        });
    }

    getCommentsByProduct(productId: number): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${this.apiUrl}?product_id=${productId}`,
            {
                headers: this.getHeaders() // Thêm headers xác thực
            }
        );
    }

    addComment(productId: number, userId: number, content: string): Observable<ApiResponse> {
        const commentDTO = {
            product_id: productId,
            user_id: userId,
            content: content
        };
        return this.http.post<ApiResponse>(this.apiUrl, commentDTO, {
            headers: this.getHeaders() // Thêm headers xác thực
        });
    }

    updateComment(commentId: number, content: string): Observable<ApiResponse> {
        return this.http.put<ApiResponse>(`${this.apiUrl}/${commentId}`, { content }, {
            headers: this.getHeaders() // Thêm headers xác thực
        });
    }

    deleteComment(commentId: number): Observable<ApiResponse> {
        return this.http.delete<ApiResponse>(`${this.apiUrl}/${commentId}`, {
            headers: this.getHeaders() // Thêm headers xác thực
        });
    }
}