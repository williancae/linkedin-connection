import { input, number } from '@inquirer/prompts';
import { Browser, Page } from 'puppeteer';
import { browserConstants } from '../config/constants.js';
import buildURL from '../utils/build-urls.js';
import { delay, delayRandom } from '../utils/delay.js';

const { like: LIKE, pages: PAGES } = browserConstants;
export default class LikeModule {
	constructor(
		private page: Page,
		private browser: Browser,
	) {
		this.page = page;
		this.browser = browser;
	}

	async getAmount() {
		console.clear();
		console.log('Quantidade de Posts que deseja curtir. Máximo: 250\nValor padrão: 20');
		let amount = 20;
		while (true) {
			const amountUser = await number({ message: 'Quantidade: ' });
			amount = amountUser ? amountUser : amount;

			if (amount < 1 || amount > 250) {
				console.log('Quantidade inválida');
				continue;
			}
			return amount;
		}
	}

	async getHashtag() {
		console.clear();
		console.log('Informe a hashtag que deseja buscar.\n' + 'Exemplo: python, javascript, node, etc.');
		const hashtag = await input({ message: 'Hashtag: ' });

		if (hashtag.length < 1) {
			return '';
		}
		return hashtag;
	}

	async likingPosts(amount = 20, hashtag = '') {
		try {
			if (hashtag) {
				await this.page.goto(buildURL('', '', hashtag));
				await delay(5000);
			}

			let count = 0;
			while (true) {
				await this.page.waitForSelector(LIKE.btnsOfPost);
				const buttons = await this.page.$$(LIKE.btnsOfPost);

				for (const button of buttons) {
					if (count >= amount) {
						return;
					}
					await button.click();
					//? TODO: mostrar no terminal o nome do post curtido e a quantidade de posts curtidos
					//? [01] - nome do post
					//? [02] - nome do post
					//? Objetivo: Mostrar que o bot está realizando a ação de curtir, algo que é essencial caso o bot seja executador em background
					await delayRandom(800, 1500);
					count++;
				}

				await this.page.waitForSelector(LIKE.btnShowMorePosts);
				await this.page.click(LIKE.btnShowMorePosts);
				await delayRandom(3000, 5000);
			}
		} catch (err) {
			console.error('Err: ', err);
		}
	}

	async run() {
		const amount = await this.getAmount();
		const hashtag = await this.getHashtag();

		try {
			await this.likingPosts(amount, hashtag);
		} catch (err) {
			await this.page.goto(PAGES.feed);
		}
	}
}
