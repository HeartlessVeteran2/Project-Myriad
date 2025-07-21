import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Card from '../components/Card';
import Button from '../components/Button';
import {VaultService} from '../services/VaultService';
import {Manga, Anime} from '../types';
import * as DocumentPicker from 'expo-document-picker';

const LibraryScreen: React.FC = () => {
  const [library, setLibrary] = useState<{manga: Manga[]; anime: Anime[]}>({
    manga: [],
    anime: [],
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'manga' | 'anime'>('manga');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLibrary();
  }, []);

  const loadLibrary = async () => {
    try {
      const vaultService = VaultService.getInstance();
      const localLibrary = await vaultService.getLocalLibrary();
      setLibrary(localLibrary);
    } catch (error) {
      console.error('Failed to load library:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportMedia = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/x-cbz',
          'application/x-cbr',
          'application/zip',
          'application/x-rar-compressed',
          'application/pdf',
          'video/mp4',
          'video/x-matroska',
          'video/x-msvideo',
          'video/webm',
        ],
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (result.canceled || !result.assets || !result.assets[0].uri) return;
      const fileUri = result.assets[0].uri;
      const fileName = result.assets[0].name || '';
      const ext = fileName.split('.').pop()?.toLowerCase();
      const vaultService = VaultService.getInstance();
      if (['cbz', 'cbr', 'zip', 'rar', 'pdf'].includes(ext)) {
        await vaultService.importManga(fileUri, {
          extractContent: true,
          generateThumbnail: true,
        });
      } else if (['mp4', 'mkv', 'avi', 'webm'].includes(ext)) {
        await vaultService.importAnime(fileUri, {generateThumbnail: true});
      } else {
        alert('Unsupported file type');
        return;
      }
      await loadLibrary();
      alert('Import successful!');
    } catch (e) {
      alert('Import failed: ' + e.message);
    }
  };

  const filteredItems = searchQuery
    ? library[activeTab].filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : library[activeTab];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Library</Text>
        <Button
          title="Import Media"
          onPress={handleImportMedia}
          style={styles.importButton}
        />
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search your library..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'manga' && styles.activeTab]}
          onPress={() => setActiveTab('manga')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'manga' && styles.activeTabText,
            ]}>
            Manga ({library.manga.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'anime' && styles.activeTab]}
          onPress={() => setActiveTab('anime')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'anime' && styles.activeTabText,
            ]}>
            Anime ({library.anime.length})
          </Text>
        </TouchableOpacity>
      </View>

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
