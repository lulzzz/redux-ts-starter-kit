import { createSelector, createSubSelector } from '../selector';

describe('createSelector', () => {
  const state = {
    form: {
      name: 'John',
      surname: 'Doe',
      middlename: 'Wayne',
    },
    auth: {
      idToken: 'a random token',
      userId: 'a user id',
    },
  };

  beforeEach(() => {
    console.error = jest.fn();
  });

  const select = createSelector('');
  const selectForm = createSelector('form');
  const selectAuth = createSelector('auth');
  const selectInvalid = createSelector('invalid');
  it('should select the correct slice', () => {
    expect(select(state)).toEqual(state);
    expect(selectForm(state)).toEqual(state.form);
    expect(selectAuth(state)).toEqual(state.auth);
  });
  it('throws when instantiated with an invalid slice', () => {
    expect(() => {
      createSelector({ slice: 'slice' } as any);
    }).toThrow(/must be a string or number or symbol/);
    expect(() => {
      createSelector(['slice',] as any);
    }).toThrow(/must be a string or number or symbol/);
  });
  it('throws when slice not present in the state', () => {
    selectInvalid(state as any);
    expect(console.error).toHaveBeenCalled();
    const [message,] = (console.error as any).mock.calls[0];
    expect(message).toContain('invalid was not found in the given State');
  });
  it('throws when called with an invalid state', () => {
    selectAuth({ form: {} } as any);

    expect(console.error).toHaveBeenCalled();
    const [message,] = (console.error as any).mock.calls[0];
    expect(message).toContain('auth was not found in the given State');
  });
});
describe('createSubSelector', () => {
  const state = {
    form: {
      name: 'John',
      surname: 'Doe',
      middlename: 'Wayne',
    },
    auth: {
      idToken: 'a random token',
      userId: 'a user id',
    },
  };
  const selectFormName = createSubSelector('form', 'name');
  const selectFormSurname = createSubSelector('form', 'surname');
  const selectFormMiddlename = createSubSelector('form', 'middlename');
  const selectAuthIdToken = createSubSelector('auth', 'idToken');
  const selectAuthUserId = createSubSelector('auth', 'userId');

  it('should throw when called with blank or non-string|number or slice subSlice', () => {
    expect(() => {
      createSubSelector('', '');
    }).toThrow(/SubSlice must not be blank/);
    expect(() => {
      createSubSelector({ gf: 'dfdf' } as any, '');
    }).toThrow(/must be a string or number or symbol/);
    expect(() => {
      createSubSelector({ slice: 'slice' } as any, 'subSlice');
    }).toThrow(/must be a string or number or symbol/);
    expect(() => {
      createSubSelector(['slice',] as any, '');
    }).toThrow(/must be a string or number or symbol/);
    expect(() => {
      createSubSelector(['slice',] as any, 'subSlice');
    }).toThrow(/must be a string or number or symbol/);
  });
  it('should select the correct subSlice', () => {
    expect(selectFormName(state)).toEqual('John');
    expect(selectFormMiddlename(state)).toEqual('Wayne');
    expect(selectFormSurname(state)).toEqual('Doe');
    expect(selectAuthIdToken(state)).toEqual('a random token');
    expect(selectAuthUserId(state)).toEqual('a user id');
  });
});
