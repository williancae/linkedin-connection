import { select } from '@inquirer/prompts';

import puppeteer from 'puppeteer';
import { browserConstants } from './config/constants';
import puppeteerConfig from './config/puppeteer.config';
import ConnectModule from './modules/connect';
import FollowerModule from './modules/follow';
import LikeModule from './modules/like';
import { LoginModule } from './modules/login';
import { delayRandom } from './utils/delay';
import header from './utils/header';

const { pages: PAGES } = browserConstants;

(async () => {
	const browser = await puppeteer.launch(puppeteerConfig);
	const page = await browser.newPage();

	await page.goto(PAGES.feed);
	await delayRandom(1000, 5000);

	const url = await page.url();

	if (url.includes('login')) {
		console.log('Realizando login...');
		await new LoginModule(browser, page).run();
	}

	header('Linkedin Bot', 'Bot para automatizar ações no Linkedin', 'green');
	while (true) {
		await page.goto(PAGES.feed);
		const option = await select({
			message: 'Select a package manager',
			choices: [
				{
					name: '1. Conectar com pessoas',
					value: 1,
				},
				{
					name: '2. Seguir pessoas',
					value: 2,
				},
				{
					name: '3. Curtir posts',
					value: 3,
				},
				{
					name: '4. Sair',
					value: 4,
				},
			],
		});

		switch (option) {
			case 1:
				//DONE:
				await new ConnectModule(browser, page).run();
				break;
			case 2:
				//DONE:
				await new FollowerModule(browser, page).run();
				break;
			case 3:
				//DONE:
				await new LikeModule(browser, page).run();
				break;
			case 4:
				await browser.close();
				return;
			default:
				console.log('Opção inválida');
				break;
		}
		console.clear();
	}
})();
