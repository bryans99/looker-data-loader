import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import { Looker40SDK } from '@looker/sdk';
import { createSdk } from './session_utils';

const createUser = async (sdk: Looker40SDK, index: number) => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = `${firstName.charAt(
    0
  )}${lastName}_${index}@yuki.com`.toLocaleLowerCase();
  const user = await sdk.ok(
    sdk.create_user({
      credentials_email: {
        email,
      },
      first_name: firstName,
      last_name: lastName,
    })
  );
  if (user?.id) {
    await sdk.ok(
      sdk.create_user_credentials_email(user.id, {
        email,
        forced_password_reset_at_next_login: true,
      })
    );
  }
  if (user?.id) {
    await sdk.ok(sdk.set_user_roles(user.id, ['4']));
  }
  console.log(`Created user ${user.id}: ${firstName} ${lastName}: ${email}`);
};

const createUsers = async () => {
  const sdk = await createSdk();
  for (let index = 1; index < 60001; index++) {
    await createUser(sdk, index);
  }
};

createUsers();
