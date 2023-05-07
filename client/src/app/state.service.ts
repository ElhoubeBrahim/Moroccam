import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";

export enum Lang {
	EN = 'English',
	FR = 'Français',
	DE = 'Deutsch',
	IT = 'Italiano',
	ES = 'Español',
	PT = 'Português',
	RU = 'Русский',
	AR = 'العربية',
	ZH = '中文',
	JA = '日本語',
	KO = '한국어',
}


export interface State {
	lang?: Lang;
}

const defaultState: State = {
	lang: Lang.EN,
};

@Injectable({ providedIn: 'root' })
export class StateService {
	private _state$: BehaviorSubject<State>;
	private getLangCode(lang: Lang): string {
		switch (lang) {
			case Lang.EN:
				return 'en';
			case Lang.FR:
				return 'fr';
			case Lang.DE:
				return 'de';
			case Lang.IT:
				return 'it';
			case Lang.ES:
				return 'es';
			case Lang.PT:
				return 'pt';
			case Lang.RU:
				return 'ru';
			case Lang.AR:
				return 'ar';
			case Lang.ZH:
				return 'zh';
			case Lang.JA:
				return 'ja';
			case Lang.KO:
				return 'ko';
		}
	}

	public get state$() : Observable<State> {
		return this._state$.asObservable();
	}

	public get lang$() : Observable<Lang | undefined> {
		return this._state$.pipe(map(state => state.lang));
	}

	public get langCode() : string {
		return this.getLangCode(this._state$.getValue().lang!);
	}

	constructor() {
		this._state$ = new BehaviorSubject<State>(defaultState);
		const localState = localStorage.getItem('state');
		if (localState) {
			this._state$.next(JSON.parse(localState));
		} else {
			this.setLang(Lang.EN);
		}
	}

	public setLang(lang: Lang) {
		this._state$.next({ ...this._state$.getValue(), lang });
		localStorage.setItem('state', JSON.stringify(this._state$.getValue()));
	}

}
