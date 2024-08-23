const browserConstants = {
	components: {
		username: 'div.t-16.t-black.t-bold',
	},
	pages: {
		feed: 'https://www.linkedin.com/feed/',
		hashtag: 'https://www.linkedin.com/feed/hashtag/{{hashtag}}/',
		search: 'https://www.linkedin.com/search/results/{{category}}/?keywords={{search}}',
		login: 'https://www.linkedin.com/login',
	},
	like: {
		cards: '#fie-impression-container',
		getName:
			'span.update-components-actor__name.hoverable-link-text.t-14.t-bold.t-black > span > span:nth-child(1)',
		btnsOfPost:
			"button.artdeco-button.artdeco-button--muted.artdeco-button--4.artdeco-button--tertiary.ember-view.social-actions-button.react-button__trigger[aria-pressed='false']",
		btnShowMorePosts:
			'.artdeco-button.artdeco-button--muted.artdeco-button--1.artdeco-button--full.artdeco-button--secondary.ember-view.scaffold-finite-scroll__load-button',
	},
	chat: {
		btnChat: '.msg-overlay-bubble-header__control--new-convo-btn',
		btnChatIsClose: "[data-test-icon='chevron-up-small']",
		btnChatIsOpen: "[data-test-icon='chevron-down-small']",
	},
	connect: {
		url: 'https://www.linkedin.com/search/results/people/?activelyHiringForJobTitles=%5B"9"%2C"25201"%2C"39"%5D&keywords={{term}',
		connectButton: `button[aria-label*="Convidar"]`,
		getName: (value: string) => value.split(' ')[1],
		btnNoSendNote: `button[aria-label*="sem nota"]`,
		btnAddNote: `button[aria-label="Adicionar nota"]`,
		inputNote: "textarea[name='message']",
		btnSendNote: "button[aria-label*='Enviar convite']",
		nextPage: "button[aria-label='Avançar']",
	},
	followers: {
		btnFollow: "button[aria-label*='Seguir']",
		nextPage: "button[aria-label='Avançar']",
	},
	comments: {
		cards: 'div#fie-impression-container',
		getName:
			'span.update-components-actor__name.hoverable-link-text.t-14.t-bold.t-black > span > span:nth-child(1)',
		btnComment: "button[aria-label='Comentar']",
		btnSend: '.m2.artdeco-button.artdeco-button--1.artdeco-button--tertiary.ember-view',
		getCommentsAuthor: 'h3.comments-comment-meta__description',
		btnShowMorePosts:
			'.artdeco-button.artdeco-button--muted.artdeco-button--1.artdeco-button--full.artdeco-button--secondary.ember-view.scaffold-finite-scroll__load-button',
	},
	jobs: {
		jobSearchUrl: 'https://www.linkedin.com/jobs/search/?keywords={{term}}',
		applyButton: 'button.jobs-apply-button',
		questionnaireSelectors: ['input[type="text"]', 'input[type="number"]', 'textarea', 'select'],
		modalButtons: [
			'button[data-easy-apply-next-button]',
			'button[data-control-name="continue_unify"]',
			'button[aria-label="Revise sua candidatura"]',
			'button[aria-label="Enviar sua candidatura"]',
			'button[aria-label="Avançar para próxima etapa"]',
		],
		nextPage: 'button.artdeco-pagination__button--next',
	},
};
export { browserConstants };
