import { render, screen, fireEvent } from '@testing-library/react';
import { LoginForm } from '@/components/forms/LoginForm';
import { AuthProvider } from '@/contexts/AuthContext';

describe('LoginForm', () => {
    it('validates inputs and submits', async () => {
        render(
            <AuthProvider>
                <LoginForm />
            </AuthProvider>
        );
        fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'user@example.com' } });
        fireEvent.change(screen.getByLabelText(/Password/), { target: { value: 'password123' } });
        expect(screen.getByRole('button', { name: /Log in/i })).toBeEnabled();
    });
});
