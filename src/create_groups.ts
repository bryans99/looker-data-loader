import { createSdk } from './session_utils';

const createGroups = async () => {
  const letters = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];
  const sdk = await createSdk();
  for (const letter of letters) {
    sdk.ok(sdk.create_group({ name: `Alphabet Group ${letter}` }));
  }
};

createGroups();
