import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Manga, Anime } from '../types';
import Card from './Card';

export type ContentItem = Manga | Anime;

interface ContentListProps {
  title?: string;
  items: ContentItem[];
  onItemPress: (item: ContentItem) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  style?: ViewStyle;
  displayMode?: 'grid' | 'list';
  showStatus?: boolean;
  showRating?: boolean;
}

const ContentList: React.FC<ContentListProps> = ({
  title,
  items,
  onItemPress,
  isLoading = false,
  emptyMessage = 'No items found',
  style,
  displayMode = 'grid',
  showStatus = true,
  showRating = true,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(displayMode);

  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  const renderItem = ({ item }: { item: ContentItem }) => {
    // Determine if the item is manga or anime based on presence of chapters or episodes
    const isManga = 'chapters' in item;
    
    // Get progress information
    const progressInfo = isManga
      ? `${item.chapters.filter(ch => ch.isRead).length}/${item.chapters.length} chapters`
      : `${item.episodes.filter(ep => ep.isWatched).length}/${item.episodes.length} episodes`;

    const progressPercentage = isManga
      ? (item.chapters.filter(ch => ch.isRead).length / item.chapters.length) * 100
      : (item.episodes.filter(ep => ep.isWatched).length / item.episodes.length) * 100;

    return (
      <TouchableOpacity
        style={[
          styles.itemContainer,
          viewMode === 'list' && styles.listItemContainer
        ]}
        onPress={() => onItemPress(item)}
        activeOpacity={0.7}
      >
        <Card style={[
          styles.itemCard,
          viewMode === 'list' && styles.listItemCard
        ]}>
          {/* Cover Image Placeholder */}
          <View style={[
            styles.coverImage,
            viewMode === 'list' && styles.listCoverImage
          ]}>
            <Text style={styles.coverPlaceholder}>
              {isManga ? '📖' : '🎬'}
            </Text>
          </View>

          <View style={[
            styles.itemDetails,
            viewMode === 'list' && styles.listItemDetails
          ]}>
            <Text style={styles.itemTitle} numberOfLines={2}>
              {item.title}
            </Text>

            {isManga && item.author && (
              <Text style={styles.itemAuthor} numberOfLines={1}>
                by {item.author}
              </Text>
            )}

            {!isManga && item.studio && (
              <Text style={styles.itemStudio} numberOfLines={1}>
                {item.studio}
              </Text>
            )}

            <Text style={styles.itemProgress}>
              {progressInfo}
            </Text>

            {showStatus && (
              <View style={styles.statusContainer}>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(item.status) }
                ]}>
                  <Text style={styles.statusText}>
                    {item.status.toUpperCase()}
                  </Text>
                </View>
              </View>
            )}

            {showRating && item.rating > 0 && (
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>
                  ⭐ {item.rating.toFixed(1)}
                </Text>
              </View>
            )}

            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${progressPercentage}%` }
                  ]}
                />
              </View>
              <Text style={styles.progressPercentage}>
                {progressPercentage.toFixed(0)}%
              </Text>
            </View>

            {/* Genres */}
            {item.genres.length > 0 && (
              <View style={styles.genresContainer}>
                {item.genres.slice(0, 3).map((genre, index) => (
                  <View key={index} style={styles.genreTag}>
                    <Text style={styles.genreText}>{genre}</Text>
                  </View>
                ))}
                {item.genres.length > 3 && (
                  <Text style={styles.moreGenres}>
                    +{item.genres.length - 3}
                  </Text>
                )}
              </View>
            )}
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing':
        return '#4CAF50';
      case 'completed':
        return '#2196F3';
      case 'hiatus':
        return '#FF9800';
      case 'upcoming':
        return '#9C27B0';
      default:
        return '#757575';
    }
  };

  const renderHeader = () => {
    if (!title) return null;

    return (
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{title}</Text>
        <TouchableOpacity
          style={styles.viewModeButton}
          onPress={toggleViewMode}
        >
          <Text style={styles.viewModeButtonText}>
            {viewMode === 'grid' ? '☰' : '⊞'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{emptyMessage}</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, style]}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading content...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {renderHeader()}
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={viewMode === 'grid' ? 2 : 1}
        key={viewMode} // Force re-render when view mode changes
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  viewModeButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  viewModeButtonText: {
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  itemContainer: {
    flex: 1,
    margin: 8,
    maxWidth: '47%',
  },
  listItemContainer: {
    maxWidth: '100%',
    marginVertical: 4,
    marginHorizontal: 8,
  },
  itemCard: {
    padding: 12,
    height: 280,
  },
  listItemCard: {
    flexDirection: 'row',
    height: 120,
    padding: 12,
  },
  coverImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  listCoverImage: {
    width: 80,
    height: 96,
    marginBottom: 0,
    marginRight: 12,
  },
  coverPlaceholder: {
    fontSize: 32,
  },
  itemDetails: {
    flex: 1,
  },
  listItemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  itemAuthor: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  itemStudio: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  itemProgress: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  statusContainer: {
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  ratingContainer: {
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 12,
    color: '#FF9800',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBarBackground: {
    flex: 1,
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginRight: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  progressPercentage: {
    fontSize: 10,
    color: '#666',
    minWidth: 30,
    textAlign: 'right',
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  genreTag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  genreText: {
    fontSize: 10,
    color: '#1976d2',
  },
  moreGenres: {
    fontSize: 10,
    color: '#666',
    alignSelf: 'center',
  },
});

export default ContentList;