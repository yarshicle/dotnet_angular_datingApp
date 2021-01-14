/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { AccountService } from './_services/account.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	title = 'The Dating App';
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	users: any;

	constructor(private accountService: AccountService) {}
	
	ngOnInit() {
		this.setCurrentUser();
	}

	setCurrentUser() {
		const user: User = JSON.parse(localStorage.getItem('user'));
		this.accountService.setCurrentUser(user);
	}
}
