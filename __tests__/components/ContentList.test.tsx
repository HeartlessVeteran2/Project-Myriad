import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ContentList, { ContentItem } from '../../src/components/ContentList';

// Mock data for testing
const mockMangaItems: ContentItem[] = [
  {
    id: '1',
    title: 'Test Manga 1',
    author: 'Author 1',
    description: 'Description 1',
    coverImage: 'https://example.com/cover1.jpg',
    chapters: [
      {
        id: 'c1',
        title: 'Chapter 1',
        chapterNumber: 1,
        pages: ['page1.jpg', 'page2.jpg'],
        readProgress: 0,
        isRead: false,
        dateAdded: new Date(),
      },
      {
        id: 'c2',
        title: 'Chapter 2',
        chapterNumber: 2,
        pages: ['page1.jpg', 'page2.jpg'],
        readProgress: 1,
        isRead: true,
        dateAdded: new Date(),
      },
    ],
    genres: ['Action', 'Adventure'],
    status: 'ongoing',
    rating: 4.5,
    tags: ['Popular', 'New'],
  },
  {
    id: '2',
    title: 'Test Manga 2',
    author: 'Author 2',
    description: 'Description 2',
    coverImage: 'https://example.com/cover2.jpg',
    chapters: [
      {
        id: 'c3',
        title: 'Chapter 1',
        chapterNumber: 1,
        pages: ['page1.jpg', 'page2.jpg'],
        readProgress: 1,
        isRead: true,
        dateAdded: new Date(),
      },
    ],
    genres: ['Comedy', 'Slice of Life'],
    status: 'completed',
    rating: 3.8,
    tags: ['Recommended'],
  },
];

// Mock the Card component since we're only testing ContentList
jest.mock('../../src/components/Card', () => {
  return function MockCard(props: any) {
    return (
      <div data-testid="mock-card" onClick={props.onPress}>
        <div data-testid="card-title">{props.title}</div>
        <div data-testid="card-tags">{props.tags?.join(',')}</div>
      </div>
    );
  };
});

describe('ContentList Component', () => {
  it('renders correctly with items', () => {
    const onItemPressMock = jest.fn();
    const { getByText, getAllByTestId } = render(
      <ContentList
        title="Test List"
        items={mockMangaItems}
        onItemPress={onItemPressMock}
      />
    );

    // Check if title is rendered
    expect(getByText('Test List')).toBeTruthy();

    // Check if cards are rendered
    const cards = getAllByTestId('mock-card');
    expect(cards.length).toBe(2);
  });

  it('renders loading state correctly', () => {
    const { getByTestId } = render(
      <ContentList
        title="Loading List"
        items={[]}
        onItemPress={() => {}}
        isLoading={true}
      />
    );

    // Check if loading indicator is shown
    expect(getByTestId('activity-indicator')).toBeTruthy();
  });

  it('renders empty state correctly', () => {
    const customEmptyMessage = 'No manga found';
    const { getByText } = render(
      <ContentList
        title="Empty List"
        items={[]}
        onItemPress={() => {}}
        emptyMessage={customEmptyMessage}
      />
    );

    // Check if empty message is shown
    expect(getByText(customEmptyMessage)).toBeTruthy();
  });

  it('toggles between grid and list view', () => {
    const { getByText, queryAllByTestId } = render(
      <ContentList
        title="Toggle View Test"
        items={mockMangaItems}
        onItemPress={() => {}}
      />
    );

    // Initially in grid view
    expect(getByText('List View')).toBeTruthy();
    
    // Toggle to list view
    fireEvent.press(getByText('List View'));
    
    // Now should be in list view
    expect(getByText('Grid View')).toBeTruthy();
    
    // In list view, additional info should be visible
    const statusElements = queryAllByTestId('status-text');
    expect(statusElements.length).toBe(2);
  });

  it('calls onItemPress when an item is pressed', () => {
    const onItemPressMock = jest.fn();
    const { getAllByTestId } = render(
      <ContentList
        items={mockMangaItems}
        onItemPress={onItemPressMock}
      />
    );

    // Press the first card
    fireEvent.press(getAllByTestId('mock-card')[0]);
    
    // Check if onItemPress was called with the correct item
    expect(onItemPressMock).toHaveBeenCalledWith(mockMangaItems[0]);
  });
});