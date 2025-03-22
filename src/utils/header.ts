import boxen from 'boxen';

export default function header(title: string = 'Linkedin Bot', description: string = '', color: string = 'green') {
	// console.clear();

	console.log('\n');
	console.log(
		boxen(description || title, {
			padding: 1,
			borderColor: color,
			dimBorder: true,
			borderStyle: 'double',
			title: title,
		}),
		'\n',
	);
}
