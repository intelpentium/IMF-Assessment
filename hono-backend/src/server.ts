import app from './app';

const port = parseInt(process.env.PORT || '4000');

console.log(`Server is running on port ${port}`);

export default {
  fetch: app.fetch,
  port,
};