const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from cwd, and fallback to parent monorepo root
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

module.exports = process.env;
