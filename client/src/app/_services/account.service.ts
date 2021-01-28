import { environment } from './../../environments/environment';
import { User } from '../_models/user';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ReplaySubject, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class AccountService {
	baseUrl = environment.apiUrl;
	private currentUserSource = new ReplaySubject<User>(1);
	currentUser$ = this.currentUserSource.asObservable();

	constructor(private http: HttpClient) {}

	login(model: unknown): Observable<void> {
		return this.http.post(this.baseUrl + 'account/login', model).pipe(
			map((response: User) => {
				const user = response;
				if (user) {
					this.setCurrentUser(user);
				}
			})
		);
	}

	register(model: unknown): Observable<void> {
		return this.http.post(this.baseUrl + 'account/register', model).pipe(
			map((user: User) => {
				if (user) {
					this.setCurrentUser(user);
				}
			})
		);
	}

	setCurrentUser(user: User): void {
		user.roles = [];
		const roles = this.getDecodedToken(user.token).role;
		Array.isArray(roles) ? (user.roles = roles) : user.roles.push(roles);
		localStorage.setItem('user', JSON.stringify(user));
		this.currentUserSource.next(user);
	}

	logout(): void {
		localStorage.removeItem('user');

		this.currentUserSource.next(null);
	}

	getDecodedToken(token: string): any {
		return JSON.parse(atob(token.split('.')[1]));
	}
}
