// Vercel entry: every request is rewritten here (see vercel.json) and handed to Nest.
module.exports = require('../dist/serverless').default;
