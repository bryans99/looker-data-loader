import { createSdk } from './session_utils';

type GroupLookup = { letter: string; id: string };

const getGroupLookup = async () => {
  const sdk = await createSdk();
  const groups = await sdk.ok(sdk.all_groups({ fields: 'id,name' }));
  return groups
    .filter((group) => group.name?.startsWith('Alphabet Group '))
    .map((group) => {
      if (group.id && group.name) {
        return {
          letter: group.name.substring(group.name.length - 1),
          id: group.id,
        };
      } else {
        return { letter: '_', id: '-1' };
      }
    })
    .reduce((map: Record<string, string>, groupLookup: GroupLookup) => {
      const newMap = { ...map };
      newMap[groupLookup.letter] = groupLookup.id;
      return newMap;
    }, {});
};

const getUsers = async () => {
  const sdk = await createSdk();
  const users = await sdk.ok(
    sdk.all_users({ fields: 'id,first_name,group_ids' })
  );
  return users;
};

const linkUsersToGroups = async () => {
  const groupLookup = await getGroupLookup();
  const users = await getUsers();
  const sdk = await createSdk();
  let index = 0;
  for (const user of users) {
    if (
      user.id &&
      user.first_name &&
      !user.first_name.includes('Marketplace Automation User')
    ) {
      const key = user.first_name.substring(0, 1);
      const groupId = groupLookup[key];
      if (groupId) {
        index++;
        if (user.group_ids?.includes(groupId)) {
          console.log(
            `${index}. User ${user.id} is already in group ${groupId} (${key})`
          );
        } else {
          await sdk.ok(sdk.add_group_user(groupId, { user_id: user.id }));
          console.log(
            `${index}. User ${user.id} added to group ${groupId} (${key})`
          );
        }
      }
    }
  }
};

linkUsersToGroups();
