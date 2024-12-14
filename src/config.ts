import dotenv from 'dotenv';

dotenv.config();
export const config = {
  MATCH_URL: process.env.MATCH_URL || '',
  MATCH_AUTH_TOKEN: process.env.MATCH_AUTH_TOKEN || '',
  PORT: parseInt(process.env.PORT || '5002'),
  LOCAL_URL: process.env.LOCAL_URL || '',
  ENV: process.env.ENV
}
