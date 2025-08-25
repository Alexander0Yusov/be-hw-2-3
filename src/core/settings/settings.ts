import dotenv from 'dotenv';

dotenv.config();

export const SETTINGS = {
  PORT: process.env.PORT || 5001,
  MONGO_URL:
    process.env.MONGO_URL ||
    'mongodb+srv://admin:admin@incubator.ueu5c87.mongodb.net/?retryWrites=true&w=majority&appName=incubator',
  DB_NAME: process.env.DB_NAME || 'incubator-blogs',
  AC_SECRET: process.env.AC_SECRET || 'abc123',
  AC_TIME: process.env.AC_TIME || '300',
};
