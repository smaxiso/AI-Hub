import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ToolCard from '../ToolCard';

describe('ToolCard', () => {
  const mockTool = {
    id: 'test-tool-1',
    name: 'Test AI Tool',
    category: 'Chat',
    url: 'https://example.com',
    description: 'A test AI tool for testing purposes',
    tags: ['test', 'ai', 'tool'],
    pricing: 'Free',
  };

  it('renders tool information correctly', () => {
    render(
      <ToolCard
        tool={mockTool}
        onFavorite={vi.fn()}
        isFavorite={false}
      />
    );

    expect(screen.getByText('Test AI Tool')).toBeInTheDocument();
    expect(screen.getByText('Chat')).toBeInTheDocument();
  });

  it('handles favorite toggle', () => {
    const onFavorite = vi.fn();
    render(
      <ToolCard
        tool={mockTool}
        onFavorite={onFavorite}
        isFavorite={false}
      />
    );

    const favoriteButton = screen.getByLabelText(/add.*to favorites/i);
    fireEvent.click(favoriteButton);

    expect(onFavorite).toHaveBeenCalledWith('test-tool-1');
  });

  it('displays favorite state correctly', () => {
    render(
      <ToolCard
        tool={mockTool}
        onFavorite={vi.fn()}
        isFavorite={true}
      />
    );

    const favoriteButton = screen.getByLabelText(/remove.*from favorites/i);
    expect(favoriteButton).toBeInTheDocument();
  });

  it('handles click events', () => {
    const onClick = vi.fn();
    render(
      <ToolCard
        tool={mockTool}
        onFavorite={vi.fn()}
        isFavorite={false}
        onClick={onClick}
      />
    );

    const card = screen.getByRole('article');
    fireEvent.click(card);

    expect(onClick).toHaveBeenCalledWith(mockTool);
  });

  it('handles keyboard events (Enter key)', () => {
    const onClick = vi.fn();
    render(
      <ToolCard
        tool={mockTool}
        onFavorite={vi.fn()}
        isFavorite={false}
        onClick={onClick}
      />
    );

    const card = screen.getByRole('article');
    fireEvent.keyPress(card, { key: 'Enter', code: 'Enter', charCode: 13 });

    expect(onClick).toHaveBeenCalledWith(mockTool);
  });

  it('displays pricing badge when available', () => {
    render(
      <ToolCard
        tool={mockTool}
        onFavorite={vi.fn()}
        isFavorite={false}
      />
    );

    expect(screen.getByText('Free')).toBeInTheDocument();
  });

  it('shows "New" badge when tool is new', () => {
    const newTool = { ...mockTool, isNew: true };
    render(
      <ToolCard
        tool={newTool}
        onFavorite={vi.fn()}
        isFavorite={false}
      />
    );

    expect(screen.getByText('New')).toBeInTheDocument();
  });
});
