import { input, number } from '@inquirer/prompts';
import { Browser, Page } from 'puppeteer';
import { browserConstants } from '../config/constants.js';
import buildURL from '../utils/build-urls.js';
import { delay, delayRandom } from '../utils/delay.js';
import header from '../utils/header.js';

const { like: LIKE, pages: PAGES } = browserConstants;
export default class LikeModule {
	constructor(
		private browser: Browser,
		private page: Page,
	) {
		this.page = page;
		this.browser = browser;
	}

	async getAmount() {
		let amount = 20;
		while (true) {
			header('Linkedin Bot', 'Quantidade de Posts que deseja curtir. Máximo: 250\nValor padrão: 20\n', 'green');
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
		header(
			'Linkedin Bot',
			'Informe a hashtag que deseja buscar.\n' +
				'Exemplo: python, javascript, node, etc.\n\nObs.: Deixe em branco para curtir posts da pagina inicial\n',
			'green',
		);

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
				await this.page.waitForSelector('#fie-impression-container');
				const cards = await this.page.$$('#fie-impression-container');
				if (cards.length === 0) {
					return;
				}
				// button of posts
				for (const card of cards) {
					const [btnLike, name] = await Promise.all([
						card.$(LIKE.btnsOfPost),
						card.$eval(LIKE.getName, el => el.textContent),
					]);
					if (!btnLike || !name) {
						continue;
					}
					if (count >= amount) {
						return;
					}

					await btnLike.click();
					count++;
					const index: string = `${count}`.padStart(2, '0');
					console.log(`[${index}] - Curtindo post de ${name}`);
					await delayRandom(800, 1500);
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
		try {
			const amount = await this.getAmount();
			const hashtag = await this.getHashtag();

			await this.likingPosts(amount, hashtag);
		} catch (err) {
			return;
		}
	}
}
