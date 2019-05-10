<?php
/**
 * Server-side code that is not directly related to the view.
 *
 * @package WordPress
 */

/**
 * Create API fields for additional info
 */
function newspack_blocks_register_rest_fields() {
	/* Add featured image source */
	register_rest_field(
		array( 'post', 'page' ),
		'featured_image_src',
		array(
			'get_callback'    => 'newspack_blocks_get_image_src',
			'update_callback' => null,
			'schema'          => null,
		)
	);

	/* Add author info source */
	register_rest_field(
		'post',
		'author_info',
		array(
			'get_callback'    => 'newspack_blocks_get_author_info',
			'update_callback' => null,
			'schema'          => null,
		)
	);

	/* Add author avatar source */
	register_rest_field(
		'post',
		'author_avatar',
		array(
			'get_callback'    => 'newspack_blocks_get_avatar',
			'update_callback' => null,
			'schema'          => null,
		)
	);

	/* Add first category source */
	register_rest_field(
		'post',
		'category_info',
		array(
			'get_callback'    => 'newspack_blocks_get_first_category',
			'update_callback' => null,
			'schema'          => null,
		)
	);
}
add_action( 'rest_api_init', 'newspack_blocks_register_rest_fields' );


/**
 * Get thumbnail featured image source for the rest field.
 *
 * @param String $object  The object type.
 * @param String $field_name  Name of the field to retrieve.
 * @param String $request  The current request object.
 */
function newspack_blocks_get_image_src( $object, $field_name, $request ) {
	$feat_img_array = wp_get_attachment_image_src(
		$object['featured_media'],
		'thumbnail',
		false
	);
	return $feat_img_array[0];
}

/**
 * Get author info for the rest field.
 *
 * @param String $object  The object type.
 * @param String $field_name  Name of the field to retrieve.
 * @param String $request  The current request object.
 */
function newspack_blocks_get_author_info( $object, $field_name, $request ) {
	/* Get the author name */
	$author_data['display_name'] = get_the_author_meta( 'display_name', $object['author'] );

	/* Get the author link */
	$author_data['author_link'] = get_author_posts_url( $object['author'] );

	/* Return the author data */
	return $author_data;
}

/**
 * Get author info for the rest field.
 *
 * @param String $object  The object type.
 * @param String $field_name  Name of the field to retrieve.
 * @param String $request  The current request object.
 */
function newspack_blocks_get_avatar( $object, $field_name, $request ) {
	/* Get the author avatar */
	$author_avatar = get_avatar( $object['author'], 48 );

	/* Return the author data */
	return $author_avatar;
}

/**
 * Get first category for the rest field.
 *
 * @param String $object  The object type.
 * @param String $field_name  Name of the field to retrieve.
 * @param String $request  The current request object.
 */
function newspack_blocks_get_first_category( $object, $field_name, $request ) {
	$object['ID']    = '';
	$categories_list = get_the_category( $object['ID'] );
	$category_info   = '';

	if ( ! empty( $categories_list ) ) {
		$category_info = '<a href="' . get_category_link( $categories_list[0]->term_id ) . '">' . $categories_list[0]->name . '</a>';
	}

	return $category_info;
}
