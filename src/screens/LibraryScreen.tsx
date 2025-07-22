          content = anime;
          break;
        case 'recommendations':
          content = recommendations.map(rec => rec.item);
          break;
        default:
          content = [...manga, ...anime];
      }
    }

    // Apply filters
    if (filters.genre.length > 0) {
      content = content.filter(item =>
        item.genres.some(genre => filters.genre.includes(genre))
      );
    }

    if (filters.status.length > 0) {
      content = content.filter(item => filters.status.includes(item.status));
    }
import React, { useEffect, useState } from 'react';
    if (filters.rating > 0) {
      content = content.filter(item => item.rating >= filters.rating);
    }

    return content;
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading your library...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={handleSearch}
        onFilterPress={() => setShowFilters(!showFilters)}
        placeholder="Search your library or use natural language..."
      />

      {showFilters && (
        <FilterPanel
          filters={filters}
          onFiltersChange={(newFilters) => dispatch(setFilters(newFilters))}
          availableGenres={[...new Set([...manga, ...anime].flatMap(item => item.genres))]}
        />
      )}

      {renderStatsCard()}
      {renderImportButtons()}
      {renderTabBar()}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {isImporting && (
        <View style={styles.importingContainer}>
          <ActivityIndicator size="small" color="#007AFF" />
          <Text style={styles.importingText}>Importing file...</Text>
        </View>
      )}

      <ContentList
        data={getFilteredContent()}
        onItemPress={(item) => {
          // Navigate to content viewer
          console.log('Open content:', item.title);
        }}
        onItemLongPress={(item) => {
          const type = 'chapters' in item ? 'manga' : 'anime';
          handleDelete(item, type);
        }}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => dispatch(loadLibrary())}
          />
        }
      />
import { Manga, Anime } from '../types';

export const LibraryScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    manga,
    anime,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  statsCard: {
    margin: 16,
    padding: 16,
    recommendations,
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  statsRow: {
    isImporting,
    justifyContent: 'space-around',
  },
  statItem: {
    searchResults,

  statNumber: {
  const { preferences } = useSelector((state: RootState) => state.user);

    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  importContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    marginBottom: 16,
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'manga' | 'anime' | 'recommendations'>('all');
    flex: 1,
    marginHorizontal: 8,
    dispatch(loadLibrary());
  tabBar: {
    }
    backgroundColor: 'white',
    marginHorizontal: 16,

    borderRadius: 8,
    padding: 4,
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
    paddingVertical: 8,
    } else {
    borderRadius: 6,

  const handleImport = async (type: 'manga' | 'anime') => {
    backgroundColor: '#007AFF',
      const result = await DocumentPicker.pick({
        type: type === 'manga'
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: 'white',
          : [DocumentPicker.types.video],
        allowMultiSelection: false,
  errorContainer: {
    backgroundColor: '#ffebee',
    margin: 16,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
      if (result.length > 0) {
  errorText: {
    color: '#c62828',
    fontSize: 14,
          generateThumbnail: true,
  importingContainer: {
    flexDirection: 'row',

        if (type === 'manga') {
    backgroundColor: '#e3f2fd',
    margin: 16,
    padding: 12,
    borderRadius: 8,
    } catch (error) {
  importingText: {
    marginLeft: 8,
    color: '#1976d2',
    Alert.alert(
        {
          text: 'Delete',
            if (type === 'manga') {
              dispatch(deleteManga(item.id));
            } else {
              dispatch(deleteAnime(item.id));
            }
          },
        },
      ]
    );
  };

  const renderStatsCard = () => (
    <Card style={styles.statsCard}>
      <Text style={styles.statsTitle}>Library Statistics</Text>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.totalManga}</Text>
          <Text style={styles.statLabel}>Manga</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.totalAnime}</Text>
          <Text style={styles.statLabel}>Anime</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{recommendations.length}</Text>
          <Text style={styles.statLabel}>Recommendations</Text>
        </View>
      </View>
    </Card>
  );

  const renderImportButtons = () => (
    <View style={styles.importContainer}>
      <Button
        title="Import Manga"
        onPress={() => handleImport('manga')}
        disabled={isImporting}
        style={styles.importButton}
      />
      <Button
        title="Import Anime"
        onPress={() => handleImport('anime')}
        disabled={isImporting}
        style={styles.importButton}
      />
    </View>
  );

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      {(['all', 'manga', 'anime', 'recommendations'] as const).map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, activeTab === tab && styles.activeTab]}
          onPress={() => setActiveTab(tab)}
        >
          <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const getFilteredContent = () => {
    let content: (Manga | Anime)[] = [];

    if (searchQuery && searchResults.length > 0) {
      content = searchResults;
    } else {
      switch (activeTab) {
        case 'manga':
          content = manga;
          break;
        case 'anime':

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.centerContent}>
            <Text style={styles.loadingText}>Loading library...</Text>
          </View>
        ) : filteredItems.length === 0 ? (
          <View style={styles.centerContent}>
            <Text style={styles.emptyText}>
              {library[activeTab].length === 0
                ? `No ${activeTab} in your library yet`
                : 'No results found'}
            </Text>
            <Text style={styles.emptySubtext}>
              Import your local media files or browse online sources
            </Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {filteredItems.map(item => (
              <Card
                key={item.id}
                title={item.title}
                imageUrl={item.coverImage}
                tags={item.genres.slice(0, 3)}
                onPress={() => console.log(`Open ${item.title}`)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  importButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchInput: {
    backgroundColor: '#2c2c2c',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#2c2c2c',
    marginHorizontal: 4,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#007BFF',
  },
  tabText: {
    color: '#CCCCCC',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    color: '#CCCCCC',
    fontSize: 16,
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#CCCCCC',
    fontSize: 14,
    textAlign: 'center',
  },
  grid: {
    paddingBottom: 20,
  },
});

export default LibraryScreen;
