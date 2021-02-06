import { ToastrService } from 'ngx-toastr';
import { MembersService } from './../../_services/members.service';
import { AccountService } from './../../_services/account.service';
import { PresenceService } from './../../_services/presence.service';
import { MessageService } from './../../_services/message.service';
import { Message } from './../../_models/message';
import { Member } from '../../_models/member';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
	NgxGalleryAnimation,
	NgxGalleryImage,
	NgxGalleryOptions
} from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { take } from 'rxjs/operators';
import { User } from 'src/app/_models/user';

@Component({
	selector: 'app-member-detail',
	templateUrl: './member-detail.component.html',
	styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit, OnDestroy {
	@ViewChild('memberTabs', { static: true }) memberTabs: TabsetComponent;
	member: Member;
	galleryOptions: NgxGalleryOptions[];
	galleryImages: NgxGalleryImage[];
	activeTab: TabDirective;
	messages: Message[] = [];
	user: User;

	constructor(
		public presence: PresenceService,
		private route: ActivatedRoute,
		private messageService: MessageService,
		private accountService: AccountService,
		private memberService: MembersService,
		private toastr: ToastrService,
		private router: Router
	) {
		this.accountService.currentUser$
			.pipe(take(1))
			.subscribe((user) => (this.user = user));
		this.router.routeReuseStrategy.shouldReuseRoute = () => false;
	}

	ngOnInit(): void {
		this.route.data.subscribe((data) => {
			this.member = data.member;
		});

		this.route.queryParams.subscribe((params) => {
			params.tab ? this.selectTab(params.tab) : this.selectTab(0);
		});

		this.galleryOptions = [
			{
				width: '500px',
				height: '500px',
				imagePercent: 100,
				thumbnailsColumns: 4,
				imageAnimation: NgxGalleryAnimation.Slide,
				preview: false
			}
		];

		this.galleryImages = this.getImages();
	}

	getImages(): NgxGalleryImage[] {
		const imageUrls = [];
		for (const photo of this.member.photos) {
			imageUrls.push({
				small: photo?.url,
				medium: photo?.url,
				big: photo?.url
			});
		}
		return imageUrls;
	}

	loadMessages(): void {
		this.messageService
			.getMessageThread(this.member.username)
			.subscribe((messages) => {
				this.messages = messages;
			});
	}

	selectTab(tabId: number): void {
		this.memberTabs.tabs[tabId].active = true;
	}

	onTabActivated(data: TabDirective): void {
		this.activeTab = data;
		if (this.activeTab.heading === 'Messages' && this.messages.length === 0) {
			this.messageService.createHubConnection(this.user, this.member.username);
		} else {
			this.messageService.stopHubConnection();
		}
	}

	addLike(): void {
		this.memberService.addLike(this.member.username).subscribe(() => {
			this.toastr.success('You have liked ' + this.member.knownAs);
		});
	}

	ngOnDestroy(): void {
		this.messageService.stopHubConnection();
	}
}
