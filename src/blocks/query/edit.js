/**
 * Internal dependencies
 */
import { QueryPanel } from '../../components/';

/**
 * External dependencies
 */
import classNames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component, Fragment, RawHTML } from '@wordpress/element';
import {
	BlockList,
	BlockEditorProvider,
	InspectorControls,
	WritingFlow,
} from '@wordpress/block-editor';
import { cloneBlock, serialize } from '@wordpress/blocks';
import { Button, PanelBody } from '@wordpress/components';
import { withSelect } from '@wordpress/data';

class Edit extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			editingPost: null,
		};
		this._blocks = props.attributes.blocks;
	}
	render = () => {
		const { attributes, className, isSelected, query, setAttributes, allTags, allCategories } = this.props;
		const { criteria, blocks, innerBlockAttributes } = attributes;
		const { editingPost } = this.state;
		const settings = {
			allowedBlockTypes: [
				'newspack-blocks/author',
				'newspack-blocks/date',
				'newspack-blocks/excerpt',
				'newspack-blocks/featured-image',
				'newspack-blocks/post-categories',
				'newspack-blocks/post-tags',
				'newspack-blocks/title',
				'core/paragraph'
			],
		};
		const classes = classNames( className, editingPost ? 'is-editing' : '' );
		return (
			<div className={ classes }>
				<InspectorControls>
					<PanelBody title={ __( 'Query Settings' ) } initialOpen={ true }>
						<QueryPanel
							criteria={ criteria }
							onChange={ criteria => setAttributes( { criteria } ) }
						/>
					</PanelBody>
				</InspectorControls>
				<section>
					{ ( query || [] ).map( post => (
						<article className={ post.id === editingPost ? 'is-editing' : '' }>e
							{ post.id === editingPost && (
								<Fragment>
									{ console.log( 'editing post:', post ) }
									<Button
										onClick={ () => {
											this.setState( { editingPost: null }, () =>
												setAttributes( { blocks: this._blocks } )
											);
										} }
									>
										{ __( 'Save' ) }
									</Button>
									<BlockEditorProvider
										value={ blocks.map( block => cloneBlock( block, { post, allTags, allCategories } ) ) }
										onChange={ blocks => ( this._blocks = blocks ) }
										onEdit={ blocks => ( this._blocks = blocks ) }
										settings={ settings }
									>
										<WritingFlow>
											<BlockList />
										</WritingFlow>
									</BlockEditorProvider>
								</Fragment>
							) }
							{ post.id !== editingPost && (
								<Fragment>
									{ ! editingPost && (
										<Button onClick={ () => this.setState( { editingPost: post.id } ) }>
											{ __( 'Edit' ) }
										</Button>
									) }
									{ blocks.map( block => (
										<RawHTML>{ serialize( cloneBlock( block, { post, allTags, allCategories } ) ) }</RawHTML>
									) ) }
								</Fragment>
							) }
						</article>
					) ) }
				</section>
			</div>
		);
	};
}
export default withSelect( ( select, props ) => {
	const { attributes } = props;
	const { criteria } = attributes;
	const { getEntityRecords } = select( 'core' );
	const taxonomyCriteria = { per_page: -1, hide_empty: true };
	return {
		query: getEntityRecords( 'postType', 'post', criteria ),
		allTags: getEntityRecords( 'taxonomy', 'post_tag', taxonomyCriteria ),
		allCategories: getEntityRecords( 'taxonomy', 'category', taxonomyCriteria )
	};
} )( Edit );
