import dotenv from 'dotenv';
import { Looker40SDK } from '@looker/sdk';
import { NodeSession } from '@looker/sdk-node';
import type { IApiSection } from '@looker/sdk-rtl';
import { DefaultSettings } from '@looker/sdk-rtl';

dotenv.config();

let lookerSession: NodeSession;

const getSession = async () => {
  if (!lookerSession) {
    const api_url =
      process.env.LOOKER_API_URL || 'https://self-signed.looker.com:19999';
    const client_id = process.env.LOOKER_CLIENT_ID || '';
    const client_secret = process.env.LOOKER_CLIENT_SECRET || '';
    const verify_ssl = process.env.LOOKER_VERIFY_SSL === 'true' || false;
    try {
      const lookerSettings = DefaultSettings();
      lookerSettings.readConfig = (): IApiSection => {
        return {
          client_id,
          client_secret,
        };
      };
      lookerSettings.base_url = api_url;
      lookerSettings.verify_ssl = verify_ssl;
      lookerSession = new NodeSession(lookerSettings);
      await lookerSession.login();
    } catch (error) {
      console.error('login failed', { error });
      throw error;
    }
  }
  return lookerSession;
};

export const loginAsUser = async (id: string) => {
  const session = await getSession();
  session.login(id);
};

export const logoutCurrentUser = async () => {
  const session = await getSession();
  if (session.isSudo()) {
    await session.logout();
  }
};

export const createSdk = async () => {
  const session = await getSession();
  return new Looker40SDK(session);
};
