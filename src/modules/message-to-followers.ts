import { Browser, Page } from 'puppeteer';

export class MessageToFollowers {
	private browser: Browser;
	private page: Page;
	constructor(browser: Browser, page: Page) {
		this.browser = browser;
		this.page = page;
	}
}
// https://www.linkedin.com/posts/willian-cae_opentowork-activity-7234650964517879809-7fbh?utm_source=share&utm_medium=member_desktop
