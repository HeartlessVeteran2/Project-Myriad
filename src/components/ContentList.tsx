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
      : `${(item as Anime).episodes.filter(ep => ep.isWatched).length}/${(item as Anime).episodes.length} episodes`;
    
    return (
      <View style={viewMode === 'grid' ? styles.gridItem : styles.listItem}>
        <Card
          title={item.title}
          imageUrl={item.coverImage}
          tags={item.genres.slice(0, 3)}
          onPress={() => onItemPress(item)}
        />
        {viewMode === 'list' && (
          <View style={styles.additionalInfo}>
            {showStatus && (
              <View style={styles.statusContainer}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            )}
            <Text style={styles.progressText}>{progressInfo}</Text>
            {showRating && (
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, style]}>
        {title && <Text style={styles.title}>{title}</Text>}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {title && (
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={toggleViewMode} style={styles.viewModeButton}>
            <Text style={styles.viewModeText}>
              {viewMode === 'grid' ? 'List View' : 'Grid View'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{emptyMessage}</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={viewMode === 'grid' ? 2 : 1}
          key={viewMode} // Force re-render when view mode changes
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  viewModeButton: {
    padding: 8,
  },
  viewModeText: {
    color: '#007BFF',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  gridItem: {
    flex: 1,
    margin: 8,
  },
  listItem: {
    marginBottom: 16,
  },
  additionalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#2c2c2c',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    marginTop: -8,
  },
  statusContainer: {
    backgroundColor: '#444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  progressText: {
    color: '#CCCCCC',
    fontSize: 12,
  },
  ratingContainer: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ContentList;