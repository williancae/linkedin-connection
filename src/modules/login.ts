import { input, password } from '@inquirer/prompts';
import { Browser, Page } from 'puppeteer';
import { browserConstants } from '../config/constants';
import { delayRandom } from '../utils/delay';

const { login: LOGIN } = browserConstants;

export class LoginModule {
	private username: string;
	private password: string;
	constructor(
		private browser: Browser,
		private page: Page,
	) {
		this.username = '';
		this.password = '';
	}

	async getCredentials() {
		do {
			this.username = await input({ message: 'E-mail ou Telefone:' });
			if (!this.username) {
				console.log('O campo de e-mail/telefone não pode estar vazio.');
			}
		} while (!this.username);

		do {
			this.password = await password({ message: 'Senha', mask: true });
			if (!this.password) {
				console.log('O campo de senha não pode estar vazio.');
			}
		} while (!this.password);
	}

	async setOnForm() {
		await this.page.type(LOGIN.email, this.username);
		await this.page.type(LOGIN.password, this.password);
		await delayRandom(500, 1000);
		await this.page.click(LOGIN.submit);
	}

	async isLoginSucess(): Promise<boolean> {
		const usernameError = await this.page
			.$eval(LOGIN.errorUsername, el => el.textContent?.trim() || null)
			.catch(() => null);
		const passwordError = await this.page
			.$eval(LOGIN.errorPassword, el => el.textContent?.trim() || null)
			.catch(() => null);

		if (usernameError && usernameError.includes('Insira um nome de usuário válido')) {
			console.log('O nome de usuário fornecido é inválido.');
			return true;
		}
		if (passwordError && passwordError.includes('A senha deve ter no mínimo 6 caracteres.')) {
			console.log('A senha fornecida deve ter pelo menos 6 caracteres.');
			return true;
		}
		if (
			[usernameError, passwordError]?.includes('E-mail ou senha incorreta. Tente novamente ou  crie uma conta .')
		) {
			console.log('E-mail ou senha incorreta.');
			return false;
		}

		return true;
	}

	async run() {
		await this.page.goto(LOGIN.url);
		await delayRandom(1500, 3000);

		do {
			console.clear();
			await this.getCredentials();
			await this.setOnForm();
		} while (await this.isLoginSucess());
	}
}
