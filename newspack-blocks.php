<?php
/**
 * Plugin Name:     Newspack Blocks
 * Plugin URI:      PLUGIN SITE HERE
 * Description:     PLUGIN DESCRIPTION HERE
 * Author:          YOUR NAME HERE
 * Author URI:      YOUR SITE HERE
 * Text Domain:     newspack-blocks
 * Domain Path:     /languages
 * Version:         1.0.0-alpha.17
 *
 * @package         Newspack_Blocks
 */

define( 'NEWSPACK_BLOCKS__BLOCKS_DIRECTORY', 'dist/' );
define( 'NEWSPACK_BLOCKS__PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'NEWSPACK_BLOCKS__VERSION', '1.0.0-alpha.17' );

require_once NEWSPACK_BLOCKS__PLUGIN_DIR . 'class-newspack-blocks.php';
require_once NEWSPACK_BLOCKS__PLUGIN_DIR . 'class-newspack-blocks-api.php';

// Newspack_Blocks handler.
$newspack_blocks = Newspack_Blocks::get_instance();

add_action( 'after_setup_theme', array( $newspack_blocks, 'add_image_sizes' ) );

Newspack_Blocks::manage_view_scripts();
add_action( 'enqueue_block_editor_assets', array( $newspack_blocks, 'enqueue_block_editor_assets' ) );
add_action( 'wp_enqueue_scripts', array( $newspack_blocks, 'enqueue_block_styles_assets' ) );

/**
 * Load language files
 *
 * @action plugins_loaded
 */
function newspack_blocks_plugin_textdomain() {
	load_plugin_textdomain( 'newspack-blocks', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
}
add_action( 'plugins_loaded', 'newspack_blocks_plugin_textdomain' );
