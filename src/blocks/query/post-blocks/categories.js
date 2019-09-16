import { registerBlockType } from '@wordpress/blocks';

import { name } from '../index';
const parent = `newspack-blocks/${ name }`;

const Edit =  ( { attributes } ) => {
	const { post, allCategories } = attributes;
	const categories = ( allCategories || [] ).filter( c => post.categories.includes( c.id ) )
	return <ul>
		{ categories.map( c => <li key={ c.id }><a href={ c.link }>{ c.name }</a></li> ) }
	</ul>
}

export const registerPostCategoriesBlock = () => registerBlockType( 'newspack-blocks/post-categories', {
	title: 'Post Categories',
	category: 'layout',
	parent,
	edit: Edit,
	save: () => null,
	attributes: {
		post: {
			type: 'object',
			default: {
				categories: [ 1, 2 ]
			}
		}
	}
} );
