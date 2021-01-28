import { UserParams } from './../../_models/userParams';
import { MembersService } from './../../_services/members.service';
import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

@Component({
	selector: 'app-member-list',
	templateUrl: './member-list.component.html',
	styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
	members: Member[];
	pagination: Pagination;
	userParams: UserParams;
	user: User;
	genderList = [
		{ value: 'male', display: 'Males' },
		{ value: 'female', display: 'Females' }
	];

	constructor(private memberService: MembersService) {
		this.userParams = memberService.getUserParams();
	}

	ngOnInit(): void {
		this.loadMembers();
	}

	loadMembers(): void {
		this.memberService.setUserParams(this.userParams);
		this.memberService.getMembers(this.userParams).subscribe((response) => {
			this.members = response.result;
			this.pagination = response.pagination;
		});
	}

	resetFilters(): void {
		this.userParams = this.memberService.resetUserParams();
		this.loadMembers();
	}

	pageChanged(event: PageChangedEvent): void {
		this.userParams.pageNumber = event.page;
		this.memberService.setUserParams(this.userParams);
		this.loadMembers();
	}
}
