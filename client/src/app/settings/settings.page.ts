import { Component, OnInit } from '@angular/core';
import { StateService } from "../state.service";

const langs = [
	'English',
	'Français',
	'Deutsch',
	'Italiano',
	'Español',
	'Português',
	'Русский',
	'العربية',
	'中文',
	'日本語',
	'한국어',
];

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
})
export class SettingsPage {
	constructor(private state: StateService) {}

	lang$ = this.state.lang$;

	protected readonly langs = langs;

	setLanguage($event: any) {
		this.state.setLang($event.detail.value);
	}
}
