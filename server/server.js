import app from './app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[server] LuxeStyle API listening on http://localhost:${PORT}`);
});
