import { Component, OnInit } from '@angular/core';
import { User } from './_models/user';
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

	ngOnInit(): void {
		this.setCurrentUser();
	}

	setCurrentUser(): void {
		const user: User = JSON.parse(localStorage.getItem('user'));
		this.accountService.setCurrentUser(user);
	}
}
