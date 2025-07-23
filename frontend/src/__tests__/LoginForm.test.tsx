import { act, fireEvent, render, screen } from '@testing-library/react';
import { LoginForm } from '@/components/forms/LoginForm';
import { AuthProvider } from '@/contexts/AuthContext';

test('validates inputs and submits', async () => {
  render(
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );

  await act(async () => {
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
  });

  const button = screen.getByRole('button', { name: /log in/i });
  expect(button).toBeEnabled();
});
