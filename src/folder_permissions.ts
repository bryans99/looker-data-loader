import { PermissionType } from '@looker/sdk';
import { createSdk } from './session_utils';

const getFolders = async () => {
  const sdk = await createSdk();
  const folders = await sdk.ok(sdk.all_folders('id,name,content_metadata_id'));
  return folders;
};

const getUsers = async () => {
  const sdk = await createSdk();
  const users = await sdk.ok(sdk.all_users({ fields: 'id,display_name' }));
  return users;
};

const getGroups = async () => {
  const sdk = await createSdk();
  const groups = await sdk.ok(sdk.all_groups({ fields: 'id,name' }));
  return groups;
};

const getRandomInt = (max: number) => Math.floor(Math.random() * max);

const addFolderPermissions = async () => {
  const sdk = await createSdk();
  const folders = await getFolders();
  const users = await getUsers();
  const groups = await getGroups();
  let index = 0;
  for (const folder of folders) {
    const folderId = Number(folder.id || -1);
    if (folderId < 95) continue;
    const userNames: string[] = [];
    let groupName: string = 'none';
    if (folder.content_metadata_id && folder.name) {
      for (let n = 0; n < 6; n++) {
        const user = users[getRandomInt(users.length - 1)];
        if (user.id && user.display_name) {
          try {
            await sdk.ok(
              sdk.create_content_metadata_access({
                content_metadata_id: folder.content_metadata_id,
                permission_type: PermissionType.edit,
                user_id: user.id,
              })
            );
            userNames.push(user.display_name);
          } catch (error: any) {
            console.error(error.message);
          }
        }
      }
      const group = groups[getRandomInt(groups.length - 1)];
      if (group.id && group.name) {
        try {
          await sdk.ok(
            sdk.create_content_metadata_access({
              content_metadata_id: folder.content_metadata_id,
              permission_type: PermissionType.edit,
              group_id: group.id,
            })
          );
          groupName = group.name;
        } catch (error: any) {
          console.error(error.message);
        }
      }
      index++;
      console.log(
        `${index}. Content access updated for folder ${
          folder.name
        }. Group: ${groupName}. Users: ${userNames.join(',')}.`
      );
    }
  }
};

addFolderPermissions();
