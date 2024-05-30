import { faker } from '@faker-js/faker';
import { Looker40SDK } from '@looker/sdk';
import { createSdk, loginAsUser, logoutCurrentUser } from './session_utils';
import { startCase } from 'lodash';

const createDashboard = async (sdk: Looker40SDK, folder_id: string) => {
  const title = `${startCase(faker.word.adjective())} ${startCase(
    faker.word.adjective()
  )} ${startCase(faker.word.adjective())}`;
  await sdk.ok(
    sdk.create_dashboard({
      folder_id,
      title,
    })
  );
  return title;
};

const getUsers = async () => {
  const sdk = await createSdk();
  const users = await sdk.ok(
    sdk.all_users({ fields: 'id,first_name,last_name,personal_folder_id' })
  );
  return users;
};

const createDashboards = async () => {
  const users = await getUsers();
  let index = 0;
  for (const user of users) {
    if (
      user.id &&
      user.personal_folder_id &&
      !user.first_name?.includes('Marketplace Automation User')
    ) {
      index++;
      await loginAsUser(user.id);
      const sdk = await createSdk();
      const title = await createDashboard(sdk, user.personal_folder_id);
      await logoutCurrentUser();
      console.log(
        `${index}. Dashboard "${title}" created for user "${user.first_name} ${user.last_name} (${user.id})"`
      );
    }
  }
};

createDashboards();
