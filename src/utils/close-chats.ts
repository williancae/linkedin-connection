import { Page } from 'puppeteer';
import { browserConstants } from '../config/constants';
import { blank } from './blank';
const {
	chat: { svgClose: ICON_CLOSE_CHAT },
} = browserConstants;
export async function closeChats(page: Page): Promise<void> {
	const iconsClose = await page.$$(ICON_CLOSE_CHAT);
	for (const icon of iconsClose) {
		if (blank(icon)) {
			continue;
		}
		await icon.evaluate(el => el.parentElement && el.parentElement.click());
		// const btnClose = await icon.$eval(ICON_CLOSE_CHAT, el => el.parentElement);
		// if (btnClose) await btnClose.click();
	}
}
