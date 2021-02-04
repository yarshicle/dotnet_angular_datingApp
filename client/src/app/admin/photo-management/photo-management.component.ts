import { ToastrService } from 'ngx-toastr';
import { AdminService } from './../../_services/admin.service';
import { Component, OnInit } from '@angular/core';
import { Photo } from 'src/app/_models/photo';

@Component({
	selector: 'app-photo-management',
	templateUrl: './photo-management.component.html',
	styleUrls: ['./photo-management.component.css']
})
export class PhotoManagementComponent implements OnInit {
	photos: Photo[];

	constructor(
		private adminService: AdminService,
		private toastr: ToastrService
	) {}

	ngOnInit(): void {
		this.getPhotosForApproval();
	}

	getPhotosForApproval(): void {
		this.adminService.getPhotosForApproval().subscribe((photos) => {
			this.photos = photos;
		});
	}

	approvePhoto(photoId: number): void {
		this.adminService.approvePhoto(photoId).subscribe(() => {
			this.photos.splice(
				this.photos.findIndex((p) => p.id === photoId),
				1
			);
			this.toastr.success('You have approved the photo');
		});
	}

	rejectPhoto(photoId: number): void {
		this.adminService.rejectPhoto(photoId).subscribe(() => {
			this.photos.splice(
				this.photos.findIndex((p) => p.id === photoId),
				1
			);
			this.toastr.success('You have rejected the photo');
		});
		this.getPhotosForApproval();
	}
}
