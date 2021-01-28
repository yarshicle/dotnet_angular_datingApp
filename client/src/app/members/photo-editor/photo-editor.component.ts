/* eslint-disable @typescript-eslint/no-unused-vars */
import { Photo } from '../../_models/photo';
import { MembersService } from './../../_services/members.service';

import { AccountService } from './../../_services/account.service';
import { Component, Input, OnInit } from '@angular/core';
import { FileUploader, ParsedResponseHeaders } from 'ng2-file-upload';
import { Member } from 'src/app/_models/member';
import { take } from 'rxjs/operators';
import { User } from 'src/app/_models/user';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-photo-editor',
	templateUrl: './photo-editor.component.html',
	styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
	@Input() member: Member;
	uploader: FileUploader;
	hasBaseDropzoneOver = false;
	baseUrl = environment.apiUrl;
	user: User;

	constructor(
		private accountService: AccountService,
		private memberService: MembersService
	) {
		this.accountService.currentUser$
			.pipe(take(1))
			.subscribe((user) => (this.user = user));
	}

	ngOnInit(): void {
		this.initializeUploader();
	}

	fileOverBase(e: boolean): void {
		this.hasBaseDropzoneOver = e;
	}

	setMainPhoto(photo: Photo): void {
		this.memberService.setMainPhoto(photo.id).subscribe(() => {
			this.user.photoUrl = photo.url;
			this.accountService.setCurrentUser(this.user);
			this.member.photoUrl = photo.url;
			this.member.photos.forEach((p) => {
				if (p.isMain) p.isMain = false;
				if (p.id === photo.id) p.isMain = true;
			});
		});
	}

	deletePhoto(photoId: number): void {
		this.memberService.deletePhoto(photoId).subscribe(() => {
			this.member.photos = this.member.photos.filter((x) => x.id !== photoId);
		});
	}

	initializeUploader(): void {
		this.uploader = new FileUploader({
			url: this.baseUrl + 'users/add-photo',
			authToken: 'Bearer ' + this.user.token,
			isHTML5: true,
			allowedFileType: ['image'],
			removeAfterUpload: true,
			autoUpload: false,
			maxFileSize: 10 * 1024 * 1024
		});

		this.uploader.onAfterAddingFile = (file) => {
			file.withCredentials = false;
		};

		this.uploader.onSuccessItem = (
			_item,
			response: string,
			_status: number,
			_headers: ParsedResponseHeaders
		) => {
			if (response) {
				const photo: Photo = JSON.parse(response);
				this.member.photos.push(photo);
				if (photo.isMain) {
					this.user.photoUrl = photo.url;
					this.member.photoUrl = photo.url;
					this.accountService.setCurrentUser(this.user);
				}
			}
		};
	}
}
