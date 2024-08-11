import { select } from '@inquirer/prompts';
import { Browser, Page } from 'puppeteer';
import { browserConstants } from '../config/constants';

import buildURL from '../utils/build-urls';
import { delayRandom } from '../utils/delay';
import header from '../utils/header';
import { getInputNumber, getInputText } from '../utils/input';

const { followers: FOLLOWERS, pages: PAGES } = browserConstants;

class FollowerModule {
	constructor(
		private browser: Browser,
		private page: Page,
	) {
		this.browser = browser;
		this.page = page;
	}

	async getAmount() {
		while (true) {
			header('Linkedin Bot', 'Quantidade de pessoas que deseja seguir. Máximo: 250\nValor padrão: 20', 'green');
			const amount = await getInputNumber('Quantidade: ', 20);
			if (isNaN(amount) || amount < 1 || amount > 250) {
				console.log('Quantidade inválida');
				continue;
			}
			return amount;
		}
	}

	async getTerm() {
		while (true) {
			header('Linkedin Bot', 'Informe o termo de busca.\nExemplo: Desenvolvedor, Recrutador, etc.', 'green');
			const term = await getInputText('Termo: ');
			if (term.length > 1) {
				return term;
			}
		}
	}

	async getCategory() {
		const categoris = ['people', 'company'];
		while (true) {
			header('Linkedin Bot', 'Seleciona a categoria que deseja buscar.', 'green');
			const category = await select({
				message: 'Categoria: ',
				choices: [
					{
						name: 'Pessoas',
						value: 'people',
					},
					{
						name: 'Empresas',
						value: 'company',
					},
				],
			});
			if (categoris.includes(category)) {
				return category;
			}
			console.log('Categoria inválida');
		}
	}

	async actionFollowers(amount = 20, term = 'recruiter', category = 'people') {
		try {
			const url = buildURL(category, term);
			await this.page.goto(url);
			await delayRandom(3000, 400);

			let count = 0;
			await this.page.waitForSelector(FOLLOWERS.btnFollow);
			const buttons = await this.page.$$(FOLLOWERS.btnFollow);
			for (const button of buttons) {
				if (count >= amount) {
					return;
				}
				await button.click();
				await delayRandom(300, 800);
				count++;
			}
		} catch (err) {
			console.error('Err: ', err);
		}
	}

	async run() {
		const amount = await this.getAmount();
		const category = await this.getCategory();
		const term = await this.getTerm();

		try {
			await this.actionFollowers(amount, term, category);
		} catch (err) {
			await this.page.goto(PAGES.feed);
		}
	}
}

export default FollowerModule;
