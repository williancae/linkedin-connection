import { select } from '@inquirer/prompts';

import puppeteer from 'puppeteer';
import { browserConstants } from './config/constants';
import puppeteerConfig from './config/puppeteer.config';
import CommentsModule from './modules/comments';
import ConnectModule from './modules/connect';
import FollowerModule from './modules/follow';
import LikeModule from './modules/like';
import { LoginModule } from './modules/login';
import { delayRandom } from './utils/delay';
import header from './utils/header';

const { pages: PAGES, components: COMPONENTS } = browserConstants;

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
		const username = (await page.$eval(COMPONENTS.username, el => el.textContent)) as string;

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
					name: '4. Comentar posts',
					value: 4,
				},
				{
					name: '5. Sair',
					value: 5,
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
				//DONE:
				await new CommentsModule(browser, page, username).run();
				break;
			case 5:
				await browser.close();
				return;
			default:
				console.log('Opção inválida');
				break;
		}
		console.clear();
	}
})();
