import { createSdk } from './session_utils';
import * as _ from 'lodash';

const getLookMLDashboardIds = async () => {
  const sdk = await createSdk();
  const dashboards = await sdk.ok(sdk.all_dashboards());
  const lookMLDashboards = dashboards.filter(
    (dashboard) => dashboard?.folder?.id === 'lookml'
  );
  const lookMLDashboardIds = Array.from(
    new Set(lookMLDashboards.map((dashboard) => dashboard.id || ''))
  );
  lookMLDashboardIds.sort();
  return lookMLDashboardIds;
};

const addLookMLDashboardsToBoardSection = async (sectionId: string) => {
  const sdk = await createSdk();
  const lookmlDashboardIds = await getLookMLDashboardIds();
  for (const lookmlDashboardId of lookmlDashboardIds) {
    try {
      sdk.ok(
        sdk.create_board_item({
          board_section_id: sectionId,
          lookml_dashboard_id: lookmlDashboardId,
        })
      );
      console.log(`added ${lookmlDashboardId} to board`);
    } catch (error: any) {
      console.error(`failed to add ${lookmlDashboardId}: ${error.message}`);
    }
  }
};

// addLookMLDashboardsToBoardSection('27');

const createBoard = async () => {
  const sdk = await createSdk();
  const lookmlDashboardIds = await getLookMLDashboardIds();
  if (lookmlDashboardIds.length === 0) {
    throw new Error('at least one lookml dashboard is required');
  }
  try {
    const board = await sdk.ok(
      sdk.create_board({
        description: 'Finopsdev repro board',
        title: 'Finopsdev repro board',
      })
    );
    if (!board.id) {
      throw new Error('board id missing');
    }
    let dashboardIndex = 0;
    for (let n = 1; n < 17; n++) {
      const section = await sdk.ok(
        sdk.create_board_section({
          board_id: board.id,
          description: `Section ${n}`,
          title: `Section ${n}`,
        })
      );
      if (!section.id) {
        throw new Error('board section id missing');
      }
      for (let m = 0; m < 3; m++) {
        sdk.ok(
          sdk.create_board_item({
            board_section_id: section.id,
            lookml_dashboard_id: lookmlDashboardIds[dashboardIndex],
          })
        );
        dashboardIndex += 1;
        if (dashboardIndex >= lookmlDashboardIds.length) {
          dashboardIndex = 0;
        }
      }
    }
    console.log(`created board ${board.id}`);
  } catch (error: any) {
    console.error(`failed to create board: ${error.message}`);
  }
};

createBoard();
