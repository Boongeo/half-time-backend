import { registerAs } from '@nestjs/config';

export default registerAs('authSecret', () => ({
  google_client_id: process.env.GOOGLE_CLIENT_ID,
  google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
  google_callback_url: process.env.GOOGLE_CALLBACK_URL,
  github_client_id: process.env.GITHUB_CLIENT_ID,
  github_client_secret: process.env.GITHUB_CLIENT_SECRET,
  github_callback_url: process.env.GITHUB_CALLBACK_URL,
  linkedin_client_id: process.env.LINKEDIN_CLIENT_ID,
  linkedin_client_secret: process.env.LINKEDIN_CLIENT_SECRET,
  linkedin_callback_url: process.env.LINKEDIN_CALLBACK_URL,
}));
