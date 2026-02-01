import AppDataSource from './data-source';

async function runMigrations() {
  try {
    // Initialize datasource (works for both Postgres and SQLite fallback)
    const dataSource = AppDataSource;
    await dataSource.initialize();

    // If using in-memory SQLite for development/CI, skip migrations since
    // entities are synchronized automatically and migrations are mainly for
    // Postgres/production. This avoids errors when the schema was already
    // created by 'synchronize'.
    const options = (dataSource.options as any) || {};
    if (options.type === 'sqlite' && options.database === ':memory:') {
      console.log('Using in-memory SQLite - skipping migrations.');
      await dataSource.destroy();
      process.exit(0);
    }

    console.log('Running migrations...');
    await dataSource.runMigrations();
    console.log('Migrations complete.');
    await dataSource.destroy();
    process.exit(0);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Migration runner error:', err);
    process.exit(1);
  }
}

runMigrations();
