import { act, render, screen } from '@testing-library/react';
import LoginPage from '../LoginPage';
import { Provider } from 'react-redux';
import { authLogin } from '../../../../store/actions';
import userEvent from '@testing-library/user-event';

jest.mock('../../../../store/actions');

const userType = (input, text) => userEvent.type(input, text);

describe('LoginPage', () => {
  const state = { ui: { isFetching: false, error: null } };
  const store = {
    getState: () => state,
    subscribe: () => {},
    dispatch: () => {},
  };

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <LoginPage />
      </Provider>,
    );

  test('snapshot', () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
  });

  test('should dispatch authLogin action', async () => {
    const username = 'keepcoder';
    const password = 'password';
    renderComponent();

    const usernameInput = screen.getByLabelText(/username/);
    const passwordInput = screen.getByLabelText(/password/);
    const submitButton = screen.getByRole('button');

    expect(submitButton).toBeDisabled();

    // fireEvent.change(usernameInput, { target: { value: username } });
    await act(() => userType(usernameInput, username));
    // fireEvent.change(passwordInput, { target: { value: password } });
    await act(() => userType(passwordInput, password));

    expect(submitButton).toBeEnabled();

    // fireEvent.click(submitButton);
    await userEvent.click(submitButton);

    expect(authLogin).toHaveBeenCalledWith({ username, password });
  });
});
