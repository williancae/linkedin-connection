import { browserConstants } from '../config/constants';
import { TypePageEnum } from './type-page';

const { pages: PAGES } = browserConstants;

export default function buildURL(
	category: string = TypePageEnum.PEOPLE,
	search: string = '',
	hashtag: string = '',
): string {
	if (search.length > 0) return PAGES.search.replace('{{category}}', category).replace('{{search}}', search);

	return PAGES.hashtag.replace('{{hashtag}}', hashtag);
}
