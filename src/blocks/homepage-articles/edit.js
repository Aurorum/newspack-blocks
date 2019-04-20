/**
 * External dependencies
 */
import classNames from 'classnames';
import { isUndefined, pickBy } from 'lodash';
import moment from 'moment';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component, Fragment, RawHTML } from '@wordpress/element';
import { InspectorControls, RichText, BlockControls } from '@wordpress/editor';
import {
	ToggleControl,
	PanelBody,
	PanelRow,
	QueryControls,
	RangeControl,
	Toolbar,
} from '@wordpress/components';
import { withSelect } from '@wordpress/data';

/**
 * Module Constants
 */
const MAX_POSTS_COLUMNS = 6;

const MAX_POSTS_TO_SHOW = 20;

class Edit extends Component {
	render() {
		/**
		 * Constants
		 */
		const { attributes, className, setAttributes, latestPosts } = this.props; // variables getting pulled out of props
		const {
			align,
			content,
			showExcerpt,
			showDate,
			showImage,
			showAuthor,
			showCategory,
			postsToShow,
			postLayout,
			mediaPosition,
			columns,
		} = attributes;

		const classes = classNames( className, {
			[ `align${ align }` ]: align !== '',
			'is-grid': postLayout === 'grid',
			[ `columns-${ columns }` ]: postLayout === 'grid',
			[ `image-align${ mediaPosition }` ]: mediaPosition !== 'top',
		} );

		const blockControls = [
			{
				icon: 'list-view',
				title: __( 'List View' ),
				onClick: () => setAttributes( { postLayout: 'list' } ),
				isActive: postLayout === 'list',
			},
			{
				icon: 'grid-view',
				title: __( 'Grid View' ),
				onClick: () => setAttributes( { postLayout: 'grid' } ),
				isActive: postLayout === 'grid',
			},
			{
				icon: 'align-none',
				title: __( 'Show media on top' ),
				isActive: mediaPosition === 'top',
				onClick: () => setAttributes( { mediaPosition: 'top' } ),
			},
			{
				icon: 'align-pull-left',
				title: __( 'Show media on left' ),
				isActive: mediaPosition === 'left',
				onClick: () => setAttributes( { mediaPosition: 'left' } ),
			},
			{
				icon: 'align-pull-right',
				title: __( 'Show media on right' ),
				isActive: mediaPosition === 'right',
				onClick: () => setAttributes( { mediaPosition: 'right' } ),
			},
		];

		const hasPosts = Array.isArray( latestPosts ) && latestPosts.length;

		return (
			<Fragment>
				<div className={ classes }>
					{ latestPosts && ( // makes sure the thing exists before trying to render, to prevent errors (sometimes block tries to render before query is done)
						<Fragment>
							{ latestPosts.map( post => (
								<article>
									{ showImage && post.featured_image_src && (
										<div className="post-thumbnail" key="thumbnail">
											<img src={ post.featured_image_src } />
										</div>
									) }
									{ showCategory && post.category_info && (
										<div className="cat-links" key="category-links">
											<RawHTML key="category">{ post.category_info }</RawHTML>
										</div>
									) }
									<h2 key="title">
										<a href={ post.link }>{ post.title.rendered.trim() }</a>
									</h2>
									{ showExcerpt && <RawHTML key="excerpt">{ post.excerpt.rendered }</RawHTML> }

									<div className="article-meta">
										{ showAuthor && (
											<span className="byline" key="byline">
												{ post.author_avatar && (
													<span className="avatar author-avatar" key="author-avatar">
														<RawHTML>{ post.author_avatar }</RawHTML>
													</span>
												) }
												<span className="author-name">
													{ __( 'by' ) }{' '}
													<span className="author vcard">
														<a className="url fn n" href={ post.author_info.author_link }>
															{ post.author_info.display_name }
														</a>
													</span>
												</span>
											</span>
										) }
										{ showDate && (
											<time className="entry-date published" key="pub-date">
												{ moment( post.date_gmt )
													.local()
													.format( 'MMMM DD, Y' ) }
											</time>
										) }
									</div>
								</article>
							) ) }
						</Fragment>
					) }
				</div>
				<BlockControls>
					<Toolbar controls={ blockControls } />
				</BlockControls>
				<InspectorControls>
					<PanelBody title={ __( 'Latest Articles Settings' ) } initialOpen={ true }>
						<PanelRow>
							<ToggleControl
								label={ __( 'Show Featured Image' ) }
								checked={ showImage }
								onChange={ () => setAttributes( { showImage: ! showImage } ) }
							/>
						</PanelRow>
						<PanelRow>
							<ToggleControl
								label={ __( 'Show Excerpt' ) }
								checked={ showExcerpt }
								onChange={ () => setAttributes( { showExcerpt: ! showExcerpt } ) }
							/>
						</PanelRow>
						<PanelRow>
							<ToggleControl
								label={ __( 'Show Date' ) }
								checked={ showDate }
								onChange={ () => setAttributes( { showDate: ! showDate } ) }
							/>
						</PanelRow>
						<PanelRow>
							<ToggleControl
								label={ __( 'Show Author' ) }
								checked={ showAuthor }
								onChange={ () => setAttributes( { showAuthor: ! showAuthor } ) }
							/>
						</PanelRow>
						<PanelRow>
							<ToggleControl
								label={ __( 'Show Category' ) }
								checked={ showCategory }
								onChange={ () => setAttributes( { showCategory: ! showCategory } ) }
							/>
						</PanelRow>
						<PanelRow>
							<QueryControls
								numberOfItems={ postsToShow }
								onNumberOfItemsChange={ value => setAttributes( { postsToShow: value } ) }
							/>
						</PanelRow>
						{ postLayout === 'grid' && (
							<PanelRow>
								<RangeControl
									label={ __( 'Columns' ) }
									value={ columns }
									onChange={ value => setAttributes( { columns: value } ) }
									min={ 2 }
									max={
										! hasPosts
											? MAX_POSTS_COLUMNS
											: Math.min( MAX_POSTS_COLUMNS, latestPosts.length )
									}
									required
								/>
							</PanelRow>
						) }
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	}
}

export default withSelect( ( select, props ) => {
	const { postsToShow } = props.attributes;
	const { getEntityRecords } = select( 'core' );
	const latestPostsQuery = pickBy(
		{
			per_page: postsToShow,
		},
		value => ! isUndefined( value )
	);
	return {
		latestPosts: getEntityRecords( 'postType', 'post', latestPostsQuery ),
	};
} )( Edit );
