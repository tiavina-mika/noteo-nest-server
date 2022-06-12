export default () => ({
  port: process.env.PORT || 10 || 8000,
  database: {
    host: process.env.DB_URL,
  },
});
