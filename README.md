# Newspack Blocks
This plugin is meant to serve as a container for most Newspack Gutenberg blocks. There may be certain blocks that relate to specific functionality in other plugins, in which case they would live with the primary functionality, but besides this exception most will live in this one.

## Setup

To get set up for block development, run `composer install && npm install`

To build blocks, run `npm run build`

To clean out the built blocks, run `npm run clean`

To get started with a new block:

- Duplicate one of the example block directories in `src/`
- Rename the directory to the slug of your block.
- At minimum edit `index.js` and change name and title definitions.
- Add the block slug to the `production` array in `src/setup/blocks.json`
- If the block requires server-side code add the slug to the `$newspack_blocks_blocks` array in `newspack-blocks.php`
- Execute `npm run build`. If all went smoothly, you should see a Newspack category in the block picker, and your block should appear within it.
