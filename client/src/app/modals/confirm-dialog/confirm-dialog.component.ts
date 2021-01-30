import { BsModalRef } from 'ngx-bootstrap/modal';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-confirm-dialog',
	templateUrl: './confirm-dialog.component.html',
	styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {
	title: string;
	message: string;
	btnOkText: string;
	btnCancelText: string;
	result: boolean;

	constructor(public bsModalRef: BsModalRef) {}

	ngOnInit(): void {}

	confirm(): void {
		this.result = true;
		this.bsModalRef.hide();
	}

	decline(): void {
		this.result = false;
		this.bsModalRef.hide();
	}
}
