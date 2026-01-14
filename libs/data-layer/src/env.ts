export const getDatabaseUrl = (): string => {
  const url = process.env.DATABASE_URL || process.env.DC_DATABASE_URL;
  if (!url) {
    throw new Error(
      'DATABASE_URL (or DC_DATABASE_URL) environment variable is required',
    );
  }
  return url;
};
