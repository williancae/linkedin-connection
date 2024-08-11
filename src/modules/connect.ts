import { Browser, ElementHandle, Page } from 'puppeteer';
import { browserConstants } from '../config/constants';

import buildURL from '../utils/build-urls';
import { delayRandom } from '../utils/delay';
import header from '../utils/header';
import { getInputNumber, getInputText } from './../utils/input';

const { connect: CONNECT, pages: PAGES } = browserConstants;

class ConnectModule {
	constructor(
		private browser: Browser,
		private page: Page,
	) {
		this.browser = browser;
		this.page = page;
	}

	async hasNote(): Promise<boolean> {
		while (true) {
			header('Linkedin Bot', 'Deseja enviar mensagem para as conexões?\n', 'green');
			const needSendNote = await getInputText('[S]/N: ', true, 's');
			if (['s', 'n'].includes(needSendNote)) {
				return needSendNote === 's';
			}
			console.clear();
			console.log('Opção inválida, tente novamente.');
		}
	}

	async getAmount(): Promise<number> {
		while (true) {
			header(
				'Linkedin Bot',
				'Quantas conexões deseja fazer?\n\nObs.: O máximo de conexões semanal permitida pelo linkedin é de 250 conexões\n',
				'green',
			);
			const amountConnections = await getInputNumber('Quantidade de conexões: ');
			if (amountConnections > 0 && amountConnections <= 250) {
				return amountConnections;
			}
			console.log('Quantidade inválida, tente novamente.');
		}
	}

	async getNote(hasGold: boolean): Promise<string> {
		const hasNote = await this.hasNote();
		if (!hasNote) {
			return '';
		}
		const lengthNote = hasGold ? 300 : 200;

		while (true) {
			header(
				'Linkedin Bot',
				`\nEscreva a mensagem que deseja enviar: Obs.: Use no máximo 200 caracteres\nAdicione a chave {{name}} para adicionar o nome do usuário que será conectado\n`,
				'green',
			);
			const note = await getInputText('Mensagem: ');
			if (note.length > 0 && note.length <= lengthNote) {
				return note;
			}
			console.warn(`Sua mensagem deve ter entre 1 e ${lengthNote} caracteres.`);
			console.log('Tente novamente.');
			await delayRandom(1000, 2000);
		}
	}

	async getTermOfSearch(): Promise<string> {
		while (true) {
			header('Linkedin Bot', 'Informe o termo de busca. Exemplo: Desenvolvedor, Recrutador, etc.\n', 'green');

			const term = await getInputText('Termo: ');
			if (term.length > 0) {
				return term;
			}
			console.log('Termo inválido, tente novamente.');
		}
	}

	async hasGoldAccount(): Promise<boolean> {
		while (true) {
			header('Linkedin Bot', 'Você possui conta premium no Linkedin?\n', 'green');
			const hasGold = await getInputText('S/[N]: ', true, 'n');
			if (['s', 'n'].includes(hasGold)) {
				return hasGold === 's';
			}
		}
	}

	async run(): Promise<void> {
		try {
			const amount = await this.getAmount();
			let terms: string | string[] = await this.getTermOfSearch();
			const hasGold = await this.hasGoldAccount();
			const note = await this.getNote(hasGold);

			terms = terms.split(',').map((hashtag: string) => hashtag.trim());
			console.log('terms: ', terms);
			for (const term of terms) {
				await this.startConnect(amount, term, note);
			}
		} catch (err) {
			return;
		}
	}
	// Olá {{name}}, muito prazer! Meu nome é Willian, tambem sou desenvolvedor. Aceite meu convite ai.... 😉 sera um prazer ter você na minha rede de conexões. Há! Estou a procura de um Job, se souber de algum me marque no post, me indica ou me mande aqui no chat. Obrigado!

	async sendWithoutNote(): Promise<void> {
		await delayRandom(800, 1300);
		await this.page.waitForSelector(CONNECT.btnNoSendNote);
		await this.page.click(CONNECT.btnNoSendNote);
	}

	async sendWithNote(people: ElementHandle<Element>, note: string): Promise<void> {
		await delayRandom(1500, 2500);
		const elemento = await people.getProperty('ariaLabel').then(el => el.jsonValue());
		const name = CONNECT.getName(elemento as string);

		await this.page.waitForSelector(CONNECT.btnAddNote);
		await this.page.click(CONNECT.btnAddNote);
		await delayRandom(800, 1500);

		const msg = note.replace('{{name}}', name);

		await this.page.waitForSelector(CONNECT.inputNote);
		await this.page.type(CONNECT.inputNote, msg);
		await delayRandom(800, 1300);

		await this.page.waitForSelector(CONNECT.btnSendNote);
		await this.page.click(CONNECT.btnSendNote);
		await delayRandom(800, 1300);
	}

	async startConnect(amount: number, term: string, note: string): Promise<void> {
		try {
			const url = buildURL('people', term, '');
			await this.page.goto(url);
			await delayRandom(2000, 5000);

			let count = 0;
			while (true) {
				await delayRandom(3000, 5000);
				await this.page.waitForSelector(CONNECT.connectButton);
				const buttonsOfPeoples = await this.page.$$(CONNECT.connectButton);
				if (buttonsOfPeoples.length === 0) {
					return;
				}
				for (const people of buttonsOfPeoples) {
					if (count >= amount) {
						return;
					}
					await delayRandom(1000, 2000);
					await people.click();

					if (note.length > 0) {
						await this.sendWithNote(people, note);
					} else {
						await this.sendWithoutNote();
					}
					count++;
				}

				await delayRandom(2000, 5000);
				await this.page.waitForSelector(CONNECT.nextPage);
				await this.page.click(CONNECT.nextPage);
			}
		} catch (err) {
			console.error('Err: ', err);
		}
	}
}

export default ConnectModule;
