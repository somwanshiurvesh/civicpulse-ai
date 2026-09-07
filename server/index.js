require('./src/config/env');
const app = require('./src/app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[CivicPulse API] Core Server is running on port ${PORT}`);
});
