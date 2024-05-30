# Looker data loader

## Purpose

Attempt to duplicate performance issues seen in cloud meta in a local environment. After running all of the jobs, performance issues are noticable.

## Description

Contains scripts that can load up a Looker instance with the following data.

1. 60,000 users
2. 60,000 empty dashboards, one per user.
3. 24 groups, each user is linked to one of the groups.
4. Each users folder grants edit permissions to 6 random users and one group. Note that it could attempt to grant edit access to the current user. If an error occurs, it is ignored.

## Setup

1. Clone the repo.
2. Run `npm install`.
3. Create a `.env` file in the root of the project. Populate with the local instance API url and an admin client id and client secret from the Looker instance. Example below.

```
LOOKER_API_URL=https://self-signed.looker.com:19999
LOOKER_CLIENT_ID=client_id
LOOKER_CLIENT_SECRET=client_secret
```

## Run the scripts

Note the scripts could be better optimized and maybe I will do so in the future. There is a separate effort to add similar functionality to the content deployer so this is likely to become obsolete fairly soon. Consider backing up your database before doing this. It will make your Looker instance harder to use.

These scripts take a while to run, so sit back and relax while running.

1. `npm run create-groups`
2. `npm run create-users`
3. `npm run create-dashboards`
4. `npm run link-users-to-groups`
5. `npm run folder-permissions`
