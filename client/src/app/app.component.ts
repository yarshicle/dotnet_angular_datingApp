import { PresenceService } from './_services/presence.service';
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

	constructor(
		private accountService: AccountService,
		private presence: PresenceService
	) {}

	ngOnInit(): void {
		this.setCurrentUser();
	}

	setCurrentUser(): void {
		const user: User = JSON.parse(localStorage.getItem('user'));

		if (user) {
			this.accountService.setCurrentUser(user);
			this.presence.createHubConnection(user);
		}
	}
}
