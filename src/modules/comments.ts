import { Browser, ElementHandle, Page } from 'puppeteer';
import { browserConstants } from '../config/constants';
import buildURL from '../utils/build-urls';
import { delayRandom } from '../utils/delay';

import header from '../utils/header';
import { getInputNumber, getInputText } from '../utils/input';
import { getRandomInt } from '../utils/random';
import { TypePageEnum } from '../utils/type-page';

const { comments: COMMENTS } = browserConstants;

class CommentsModule {
	private commentedPost: string[] = [];

	constructor(
		private browser: Browser,
		private page: Page,
		private username: string,
	) {
		this.commentedPost = [];
		this.browser = browser;
		this.page = page;
		this.username = username.trim();
	}

	async getPosts() {
		let response = [];
		const cards = await this.page.$$(COMMENTS.cards);
		for (const card of cards) {
			const name = (await card.$eval(COMMENTS.getName, el => el.textContent)) as string;
			if (this.commentedPost.includes(name)) {
				continue;
			}
			const button = await card.$(COMMENTS.btnComment);

			response.push({ card, name, button });
		}
		return response;
	}

	async setComment(card: ElementHandle<Element>, btn: ElementHandle<Element>, name: string, message: string) {
		name = name.split(' ')[0];
		message = message.replace('{{name}}', name).trim();
		await delayRandom(500, 1000);
		await btn.click();
		await delayRandom(800, 1200);
		const comments = await card.$$eval(COMMENTS.getCommentsAuthor, el =>
			el.map(comment => comment.textContent?.replace('\n', '').trim()),
		);
		if (comments.includes(this.username)) {
			return;
		}

		await delayRandom(800, 1500);
		await this.page.keyboard.type(message, { delay: getRandomInt(50, 80) });
		await delayRandom(800, 1000);

		// await this.page.waitForSelector(COMMENTS.btnSend);
		const btnSend = await this.page.$(COMMENTS.btnSend);
		if (!btnSend) {
			return;
		}
		await delayRandom(800, 1000);
		await btnSend.click();
	}

	async getTerm() {
		// "Estou Comemorando"  and "ano na"
		// "scrum master" and "vaga"
		while (true) {
			header('Linkedin Bot', 'Informe o termo de busca.\nExemplo: "Estou comemorando 13 anos na", ', 'green');
			const term = await getInputText('Termo: ');
			if (term.length > 1) {
				return term;
			}
		}
	}

	async getComment() {
		// Parabéns pela conquista, {{name}}! 🎉🎉🎉
		// Boa sorte na procura, {{name}}. Vai dá tudo certo!! 🙌 #opentowork
		// Recomendo meu amigo, Pedro Fortes! Melhor Scrum com quem já trabalhei. Perfil: https://www.linkedin.com/in/fortespedro/
		while (true) {
			header(
				'Linkedin Bot',
				'Digite a mensagem que deseja comentar\nObs.:Lembre de ser genério e escrever um comentário relacionado ao termo de pesquisa.',
				'green',
			);
			const comment = await getInputText('Comentário: ');
			if (comment.length > 0) {
				return comment;
			}
		}
	}

	async getAmount() {
		while (true) {
			header('Linkedin Bot', 'Quantidade de posts que deseja comentar. Máximo: 250\nValor padrão: 20\n', 'green');
			const amountPosts = await getInputNumber('Quantidade: ', 20);
			if (amountPosts < 1 || amountPosts > 250) {
				continue;
			}
			return amountPosts;
		}
	}

	async run() {
		let count = 0;
		const term = await this.getTerm();
		const amount = await this.getAmount();
		let comment = await this.getComment();
		const url = buildURL(TypePageEnum.PUBLICATIONS, term);
		await this.page.goto(url);
		await delayRandom(3000, 5000);
		while (true) {
			const posts = await this.getPosts();

			for (const post of posts) {
				if (count >= amount) {
					return;
				}

				const { button, card, name } = post;
				if (!button) {
					continue;
				}
				await delayRandom(1000, 3000);

				await this.setComment(card, button, name, comment);
				this.commentedPost.push(name);

				await this.page.waitForSelector(COMMENTS.btnShowMorePosts);
				const btnShowMorePosts = await this.page.$(COMMENTS.btnShowMorePosts);
				await delayRandom(1000, 2000);
				if (btnShowMorePosts) {
					console.log('Show more posts');
					await btnShowMorePosts.click();
				}

				count++;
			}
		}
	}
}

export default CommentsModule;
