    }

    const library = [...manga, ...anime];
    dispatch(analyzeArtStyle({ imageBase64: selectedImage, library }));
  };

  const handleMetadataExtraction = async () => {
    if (!selectedImage) {
      Alert.alert('No Image', 'Please select an image first');
      return;
    }

    dispatch(extractMetadata(selectedImage));
  };

import React, { useState, useEffect } from 'react';
    if (!searchQuery.trim()) {
      Alert.alert('No Query', 'Please enter a search query');
      return;
    }

    const library = [...manga, ...anime];
    const result = await dispatch(performNaturalLanguageSearch({ query: searchQuery, library }));
    if (result.payload) {
      setSearchResults(result.payload.results);
    }
  ScrollView,
  TouchableOpacity,
  const renderFeatureButtons = () => (
    <View style={styles.featureButtons}>
      {([
        { key: 'ocr', title: 'OCR Translation', icon: '🔤' },
        { key: 'artStyle', title: 'Art Style', icon: '🎨' },
        { key: 'metadata', title: 'Metadata', icon: '📊' },
        { key: 'search', title: 'NL Search', icon: '🔍' },
      ] as const).map(({ key, title, icon }) => (
        <TouchableOpacity
          key={key}
          style={[
            styles.featureButton,
            activeFeature === key && styles.activeFeatureButton,
          ]}
          onPress={() => setActiveFeature(key)}
        >
          <Text style={styles.featureIcon}>{icon}</Text>
          <Text style={[
            styles.featureButtonText,
            activeFeature === key && styles.activeFeatureButtonText,
          ]}>
            {title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
import { useDispatch, useSelector } from 'react-redux';
  const renderStatusCard = () => (
    <Card style={styles.statusCard}>
      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>AI Status:</Text>
        <Text style={[
          styles.statusValue,
          { color: isInitialized ? '#4caf50' : '#f44336' }
        ]}>
          {isInitialized ? 'Ready' : 'Initializing...'}
        </Text>
      </View>
      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>Mode:</Text>
        <Text style={[
          styles.statusValue,
          { color: isOfflineMode ? '#ff9800' : '#2196f3' }
        ]}>
          {isOfflineMode ? 'Offline' : 'Online'}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => dispatch(setOfflineMode(!isOfflineMode))}
      >
        <Text style={styles.toggleButtonText}>
          Switch to {isOfflineMode ? 'Online' : 'Offline'}
        </Text>
      </TouchableOpacity>
    </Card>
  );
import { ContentList } from '../components/ContentList';
  const renderOCRFeature = () => (
    <View style={styles.featureContainer}>
      <Text style={styles.featureTitle}>OCR Translation</Text>
      <Text style={styles.featureDescription}>
        Extract and translate text from manga panels using Tesseract OCR
      </Text>

      <Button
        title="Select Image"
        onPress={handleImagePicker}
        style={styles.actionButton}
      />

      {selectedImage && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: `data:image/jpeg;base64,${selectedImage}` }}
            style={styles.selectedImage}
            resizeMode="contain"
          />
          <Button
            title="Translate Text"
            onPress={handleOCRTranslation}
            disabled={isProcessing}
            style={styles.actionButton}
          />
        </View>
      )}

      {currentTranslation && (
        <Card style={styles.translationCard}>
          <Text style={styles.translationLabel}>Original:</Text>
          <Text style={styles.translationText}>{currentTranslation.originalText}</Text>
          <Text style={styles.translationLabel}>Translation:</Text>
          <Text style={styles.translationText}>{currentTranslation.translatedText}</Text>
          <Text style={styles.translationMeta}>
            Confidence: {(currentTranslation.confidence * 100).toFixed(1)}%
          </Text>
        </Card>
      )}

      {translations.length > 0 && (
        <View style={styles.historyContainer}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>Translation History</Text>
            <TouchableOpacity onPress={() => dispatch(clearTranslations())}>
              <Text style={styles.clearButton}>Clear</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.historyList}>
            {translations.slice(0, 5).map((translation, index) => (
              <Card key={index} style={styles.historyItem}>
                <Text style={styles.historyOriginal}>{translation.originalText}</Text>
                <Text style={styles.historyTranslation}>{translation.translatedText}</Text>
              </Card>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
  const { manga, anime } = useSelector((state: RootState) => state.library);
  const renderArtStyleFeature = () => (
    <View style={styles.featureContainer}>
      <Text style={styles.featureTitle}>Art Style Analysis</Text>
      <Text style={styles.featureDescription}>
        Find similar content based on art style using computer vision
      </Text>

      <Button
        title="Select Image"
        onPress={handleImagePicker}
        style={styles.actionButton}
      />

      {selectedImage && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: `data:image/jpeg;base64,${selectedImage}` }}
            style={styles.selectedImage}
            resizeMode="contain"
          />
          <Button
            title="Analyze Art Style"
            onPress={handleArtStyleAnalysis}
            disabled={isProcessing}
            style={styles.actionButton}
          />
        </View>
      )}

      {artStyleMatches.length > 0 && (
        <View style={styles.matchesContainer}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>Similar Content</Text>
            <TouchableOpacity onPress={() => dispatch(clearArtStyleMatches())}>
              <Text style={styles.clearButton}>Clear</Text>
            </TouchableOpacity>
          </View>
          <ContentList
            data={artStyleMatches.map(match => match.item)}
            onItemPress={(item) => console.log('Open similar content:', item.title)}
            style={styles.matchesList}
            renderItem={({ item: match }) => (
              <Card style={styles.matchItem}>
                <Text style={styles.matchTitle}>{match.item.title}</Text>
                <Text style={styles.matchSimilarity}>
                  Similarity: {(match.similarity * 100).toFixed(1)}%
                </Text>
                <Text style={styles.matchStyle}>Style: {match.artStyle}</Text>
              </Card>
            )}
          />
      title: 'Select Image',
      )}
    </View>
  );
      storageOptions: {
  const renderSearchFeature = () => (
    <View style={styles.featureContainer}>
      <Text style={styles.featureTitle}>Natural Language Search</Text>
      <Text style={styles.featureDescription}>
        Search your library using natural language queries
      </Text>

      <TextInput
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="e.g., 'Show me action manga with romance'"
        multiline
      />

      <Button
        title="Search"
        onPress={handleNaturalLanguageSearch}
        disabled={isProcessing || !searchQuery.trim()}
        style={styles.actionButton}
      />

      {searchResults.length > 0 && (
        <View style={styles.searchResultsContainer}>
          <Text style={styles.historyTitle}>Search Results</Text>
          <ContentList
            data={searchResults}
            onItemPress={(item) => console.log('Open search result:', item.title)}
            style={styles.searchResultsList}

        </View>
      )}
    </View>
  );

  const renderActiveFeature = () => {
    switch (activeFeature) {
      case 'ocr':
        return renderOCRFeature();
      case 'artStyle':
        return renderArtStyleFeature();
      case 'metadata':
        return renderOCRFeature(); // Metadata extraction uses similar UI
      case 'search':
        return renderSearchFeature();
      default:
        return renderOCRFeature();
    }
  };

  if (!isInitialized && isProcessing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Initializing AI Core...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {renderStatusCard()}
      {renderFeatureButtons()}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>

      )}

      {isProcessing && (
        <View style={styles.processingContainer}>
          <ActivityIndicator size="small" color="#007AFF" />
          <Text style={styles.processingText}>Processing...</Text>
        </View>
      )}

      {renderActiveFeature()}
    </ScrollView>
      targetLanguage: settings.defaultTargetLanguage,
      confidence: 0.8,
    };

    dispatch(translateText({ imageBase64: selectedImage, options }));
  };
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  const handleArtStyleAnalysis = async () => {
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
      return;
  statusCard: {
    margin: 16,
    padding: 16,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    setNlLoading(false);
  };
  statusLabel: {
    fontSize: 16,
    color: '#666',
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '600',
        <Text style={styles.title}>AI Core</Text>
  toggleButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  featureButtons: {
    flexDirection: 'row',
    marginHorizontal: 16,
          <Text style={styles.featureTitle}>OCR Translation</Text>
          <Text style={styles.featureDescription}>Translate manga text in real-time using AI</Text>
  featureButton: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12,
    margin: 2,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeFeatureButton: {
    backgroundColor: '#007AFF',
  },
  featureIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  featureButtonText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  activeFeatureButtonText: {
    color: 'white',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    margin: 16,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e3f2fd',
    margin: 16,
    padding: 12,
    borderRadius: 8,
  },
  processingText: {
    marginLeft: 8,
    color: '#1976d2',
    fontSize: 14,
  },
  featureContainer: {
    margin: 16,
  },
          {ocrImage && <Image source={{ uri: ocrImage }} style={{ width: 100, height: 140, marginTop: 8 }} />}
          {ocrLoading && <ActivityIndicator color="#fff" style={{ marginTop: 8 }} />}
          {ocrResult && (
    marginBottom: 8,
              <Text style={{ color: '#fff' }}>Translated: {ocrResult.translatedText}</Text>
              <Text style={{ color: '#aaa' }}>Confidence: {Math.round(ocrResult.confidence * 100)}%</Text>
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  actionButton: {
    marginBottom: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  selectedImage: {
    width: 200,
    height: 200,
    marginBottom: 16,
    borderRadius: 8,
  },
  translationCard: {
    padding: 16,
    marginBottom: 16,
  },
  translationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  translationText: {
    fontSize: 16,
    marginBottom: 12,
  },
  translationMeta: {
    fontSize: 12,
    color: '#999',
  },
  historyContainer: {
    marginTop: 16,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearButton: {
    color: '#007AFF',
    fontSize: 16,
  },
  historyList: {
    maxHeight: 200,
  },
  historyItem: {
    padding: 12,
    marginBottom: 8,
  },
  historyOriginal: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  historyTranslation: {
    fontSize: 16,
  },
  matchesContainer: {
    marginTop: 16,
  },
  matchesList: {
    maxHeight: 300,
  },
  matchItem: {
    padding: 12,
    marginBottom: 8,
  },
  matchTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  matchSimilarity: {
    fontSize: 14,
    color: '#4caf50',
    marginBottom: 2,
  },
  matchStyle: {
    fontSize: 12,
    color: '#666',
  },
  searchInput: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  searchResultsContainer: {
    marginTop: 16,
  },
  searchResultsList: {
    maxHeight: 400,
        </TouchableOpacity>

          <Text style={styles.featureTitle}>Art Style Matching</Text>
          <Text style={styles.featureDescription}>Find similar manga/anime by art style</Text>
          {artImage && <Image source={{ uri: artImage }} style={{ width: 100, height: 140, marginTop: 8 }} />}
          {artLoading && <ActivityIndicator color="#fff" style={{ marginTop: 8 }} />}
          {artResult && artResult.length > 0 && (
            <View style={{ marginTop: 8 }}>
              <Text style={{ color: '#fff' }}>Matches:</Text>
              {artResult.map((item: any, idx: number) => (
                <Text key={idx} style={{ color: '#fff' }}>{item.title}</Text>
              ))}
            </View>
          )}
        </TouchableOpacity>

        {/* Smart Recommendations */}
        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>Smart Recommendations</Text>
          <Text style={styles.featureDescription}>Discover new content based on your preferences</Text>
          <TouchableOpacity onPress={handleGetRecommendations} style={{ marginTop: 8, backgroundColor: '#333', padding: 8, borderRadius: 6 }}>
            <Text style={{ color: '#fff' }}>Get Recommendations</Text>
          </TouchableOpacity>
          {recLoading && <ActivityIndicator color="#fff" style={{ marginTop: 8 }} />}
          {recResult && (
            <View style={{ marginTop: 8 }}>
              <Text style={{ color: '#fff' }}>Manga: {recResult.manga.length}</Text>
              <Text style={{ color: '#fff' }}>Anime: {recResult.anime.length}</Text>
            </View>
          )}
        </View>

        {/* Natural Language Search */}
        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>Natural Language Search</Text>
          <Text style={styles.featureDescription}>Search for manga/anime using natural language</Text>
          <TextInput
            style={{ backgroundColor: '#222', color: '#fff', marginTop: 8, borderRadius: 6, padding: 8 }}
            placeholder="e.g. Find action manga with strong female protagonists"
            placeholderTextColor="#888"
            value={nlQuery}
            onChangeText={setNlQuery}
          />
          <TouchableOpacity onPress={handleNaturalLanguageSearch} style={{ marginTop: 8, backgroundColor: '#333', padding: 8, borderRadius: 6 }}>
            <Text style={{ color: '#fff' }}>Search</Text>
          </TouchableOpacity>
          {nlLoading && <ActivityIndicator color="#fff" style={{ marginTop: 8 }} />}
          {nlResult && nlResult.length > 0 && (
            <View style={{ marginTop: 8 }}>
              {nlResult.map((item: any, idx: number) => (
                <Text key={idx} style={{ color: '#fff' }}>{item.title}</Text>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#aaa',
    marginBottom: 24,
  },
  featureCard: {
    backgroundColor: '#232323',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 15,
    color: '#bbb',
  },
});

export default AICoreScreen;
