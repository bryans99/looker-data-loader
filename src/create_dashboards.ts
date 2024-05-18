import { faker } from '@faker-js/faker';
import { Looker40SDK } from '@looker/sdk';
import { createSdk, loginAsUser, logoutCurrentUser } from './session_utils';

const createDashboard(sdk: Looker40SDK)  {

}

const createDashboards = async () => {
  await loginAsUser('');
  const sdk = await createSdk();
    await createDashboard(sdk);
};

createDashboards();
