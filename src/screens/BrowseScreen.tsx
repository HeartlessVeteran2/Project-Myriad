import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Card from '../components/Card';
import Button from '../components/Button';
import {BrowserService} from '../services/BrowserService';
import {Manga, Anime, Source} from '../types';

const BrowseScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'manga' | 'anime'>('manga');
  const [searchResults, setSearchResults] = useState<{manga: Manga[]; anime: Anime[]}>({
    manga: [],
    anime: [],
  });
  const [sources, setSources] = useState<Source[]>([]);
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadSources();
  }, []);

  const loadSources = () => {
    const browserService = BrowserService.getInstance();
    const availableSources = browserService.getSources(activeTab);
    setSources(availableSources);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const browserService = BrowserService.getInstance();

      if (activeTab === 'manga') {
        const results = await browserService.searchManga(
          searchQuery,
          selectedSource === 'all' ? undefined : selectedSource
        );
        setSearchResults(prev => ({...prev, manga: results}));
      } else {
        const results = await browserService.searchAnime(
          searchQuery,
          selectedSource === 'all' ? undefined : selectedSource
        );
        setSearchResults(prev => ({...prev, anime: results}));
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleTabChange = (tab: 'manga' | 'anime') => {
    setActiveTab(tab);
    setSearchResults({manga: [], anime: []});
    setSelectedSource('all');
    loadSources();
  };

  const filteredSources = sources.filter(source => source.type === activeTab);
  const currentResults = searchResults[activeTab];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Browse Online</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'manga' && styles.activeTab]}
          onPress={() => handleTabChange('manga')}>
          <Text style={[styles.tabText, activeTab === 'manga' && styles.activeTabText]}>
            Manga
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'anime' && styles.activeTab]}
          onPress={() => handleTabChange('anime')}>
          <Text style={[styles.tabText, activeTab === 'anime' && styles.activeTabText]}>
            Anime
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder={`Search ${activeTab}...`}
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          <Button
            title="Search"
            onPress={handleSearch}
            style={styles.searchButton}
            disabled={isSearching || !searchQuery.trim()}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.sourceSelector}>
          <TouchableOpacity
            style={[
              styles.sourceChip,
              selectedSource === 'all' && styles.activeSourceChip,
            ]}
            onPress={() => setSelectedSource('all')}>
            <Text
              style={[
                styles.sourceChipText,
                selectedSource === 'all' && styles.activeSourceChipText,
              ]}>
              All Sources
            </Text>
          </TouchableOpacity>
          {filteredSources.map(source => (
            <TouchableOpacity
              key={source.id}
              style={[
                styles.sourceChip,
                selectedSource === source.id && styles.activeSourceChip,
                !source.isEnabled && styles.disabledSourceChip,
              ]}
              onPress={() => source.isEnabled && setSelectedSource(source.id)}
              disabled={!source.isEnabled}>
              <Text
                style={[
                  styles.sourceChipText,
                  selectedSource === source.id && styles.activeSourceChipText,
                  !source.isEnabled && styles.disabledSourceChipText,
                ]}>
                {source.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isSearching ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#007BFF" />
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        ) : currentResults.length === 0 ? (
          <View style={styles.centerContent}>
            <Text style={styles.emptyText}>
              {searchQuery ? 'No results found' : `Search for ${activeTab} content`}
            </Text>
            <Text style={styles.emptySubtext}>
              Try different keywords or check your internet connection
            </Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {currentResults.map(item => (
              <Card
                key={item.id}
                title={item.title}
                imageUrl={item.coverImage}
                tags={item.genres.slice(0, 3)}
                onPress={() => console.log(`View ${item.title}`)}
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
    padding: 20,
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
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
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#2c2c2c',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
    marginRight: 12,
  },
  searchButton: {
    paddingHorizontal: 20,
  },
  sourceSelector: {
    maxHeight: 50,
  },
  sourceChip: {
    backgroundColor: '#2c2c2c',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  activeSourceChip: {
    backgroundColor: '#007BFF',
  },
  disabledSourceChip: {
    opacity: 0.5,
  },
  sourceChipText: {
    color: '#CCCCCC',
    fontSize: 14,
    fontWeight: '500',
  },
  activeSourceChipText: {
    color: '#FFFFFF',
  },
  disabledSourceChipText: {
    color: '#666',
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
    marginTop: 12,
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

export default BrowseScreen;
