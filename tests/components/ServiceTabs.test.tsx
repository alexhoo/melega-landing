// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ServiceTabs from '../../src/components/ServiceTabs';
import { services } from '../../src/data/services';

afterEach(cleanup);

describe('ServiceTabs', () => {
  it('shows empresa by default', () => {
    render(<ServiceTabs groups={services} />);
    expect(screen.getByRole('tab', { name: 'Empresa e industria' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Media y baja tensión')).toBeVisible();
  });

  it('switches to hogar on click', async () => {
    render(<ServiceTabs groups={services} />);
    await userEvent.click(screen.getByRole('tab', { name: 'Hogar y comercio' }));
    expect(screen.getByText('Instalaciones fotovoltaicas')).toBeVisible();
    expect(screen.getByText('Media y baja tensión').closest('[role="tabpanel"]')).toHaveAttribute('hidden');
  });

  it('arrow keys move between tabs', async () => {
    render(<ServiceTabs groups={services} />);
    screen.getByRole('tab', { name: 'Empresa e industria' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    const hogar = screen.getByRole('tab', { name: 'Hogar y comercio' });
    expect(hogar).toHaveAttribute('aria-selected', 'true');
    expect(hogar).toHaveFocus();
  });
});
