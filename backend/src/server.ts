import app from './app';

const PORT = process.env.PORT ?? 3000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚗 Car Inventory API running on http://localhost:${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV ?? 'development'}`);
  });
}

export default app;
