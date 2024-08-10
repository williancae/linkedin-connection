import fs from 'fs';
import { Browser, Page } from 'puppeteer';
import { browserConstants } from '../config/constants';
import { delayRandom } from '../utils/delay';
const { pages: PAGES } = browserConstants;

export class LoginModule {
	constructor(
		private browser: Browser,
		private page: Page,
	) {}

	async saveCookies(): Promise<void> {
		const cookies = await this.page.cookies();
		fs.writeFileSync('cookies.json', JSON.stringify(cookies, null, 2));
	}

	async loadCookies(): Promise<void> {
		if (fs.existsSync('cookies.json')) {
			const cookiesString = fs.readFileSync('cookies.json').toString();
			const cookies = JSON.parse(cookiesString);

			for (const cookie of cookies) {
				await this.page.setCookie(cookie);
			}
		}
		return;
	}

	async redirectedToFeed(): Promise<boolean> {
		const url = await this.page.url();
		const onFeed = url.includes('feed');
		if (onFeed) {
			await delayRandom(1000, 5000);
			await this.loadCookies();
		}

		return onFeed;
	}

	async run() {
		await this.page.goto(PAGES.login);
		await delayRandom(1000, 5000);
		do {
			await delayRandom(1000, 5000);
		} while (!this.redirectedToFeed());

		await this.saveCookies();
	}
}
