import dotenv from 'dotenv';
import { Looker40SDK } from '@looker/sdk';
import { NodeSession } from '@looker/sdk-node';
import type { IApiSection } from '@looker/sdk-rtl';
import { DefaultSettings } from '@looker/sdk-rtl';

dotenv.config();

const createSdk = async () => {
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
    const lookerSession = new NodeSession(lookerSettings);
    await lookerSession.login();
    return new Looker40SDK(lookerSession);
  } catch (error) {
    console.error('login failed', { error });
    throw error;
  }
};

const createUser = async (sdk, index: number) => {
  await sdk.ok(
    sdk.create_user({
      credentials_email: {
        email: '',
      },
      first_name: '',
      home_folder_id: '',
      is_disabled: false,
      last_name: '',
      locale: '',
      models_dir_validated: false,
      ui_state: {},
    })
  );
};

const createUsers = async () => {
  const sdk = await createSdk();
  for (let index = 1; index < 100; index++) {
    await createUser(sdk, index);
  }
};

createUsers();
