import { select } from '@inquirer/prompts';
import { Browser, ElementHandle, Page } from 'puppeteer';
import { browserConstants } from '../config/constants';
import { closeChats } from '../utils/close-chats';
import { delayRandom } from '../utils/delay';
import { getInputNumber } from '../utils/input';
const {
	btns: { ofInteraction: OF_INTERACTION, sendMessage: SEND_MESSAGE },
	info: { btnLabel: BTN_LABEL },
	options: OPTIONS,
	url: URL,
} = browserConstants.interact_with_my_network;

export class InteractWithMyNetworkModule {
	constructor(
		private browser: Browser,
		private page: Page,
	) {
		this.browser = browser;
		this.page = page;
	}

	async getAmount(): Promise<number> {
		while (true) {
			const amountConnections = await getInputNumber('Quantidade de interações. default[20]: ', 20);
			if (amountConnections > 0 && amountConnections <= 250) {
				return amountConnections;
			}
			console.log('Quantidade inválida, tente novamente.');
		}
	}

	async getOption(): Promise<string> {
		const option = await select({
			message: 'Selecione uma opção',
			choices: OPTIONS.map(option => option),
		});
		return option;
	}

	async getFirstBtns(): Promise<ElementHandle[]> {
		await delayRandom(3000, 5000);
		await this.page.waitForSelector(OF_INTERACTION);
		const btns = await this.page.$$(OF_INTERACTION);
		return btns;
	}

	async run(): Promise<void> {
		const option = await this.getOption();
		const url = URL.replace('{{option}}', option);
		await this.page.goto(url);
		await delayRandom(3000, 5000);

		let count = 0;
		const amountConnections = await this.getAmount();

		while (true) {
			console.log('Interagindo com as conexões...');
			const firstBtns = await this.getFirstBtns();
			if (firstBtns.length === 0) {
				console.log('Nenhuma interação disponível');
				return;
			}

			for await (let btn of firstBtns) {
				const btnLabel = (await btn.$eval(BTN_LABEL, el => el.textContent)) as string;
				if (btnLabel.includes('atrasado')) {
					continue;
				}
				await btn.click();
				await delayRandom(2000, 3000);
				const sendMessageBtn = await this.page.waitForSelector(SEND_MESSAGE);
				await sendMessageBtn?.click();
				await delayRandom(2000, 3000);

				await closeChats(this.page);
				count++;
				if (count >= amountConnections) {
					return;
				}
			}
		}
	}
}
