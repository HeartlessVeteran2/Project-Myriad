import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AIService } from '../services/AIService';

const AICoreScreen: React.FC = () => {
  const [ocrResult, setOcrResult] = useState(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrImage, setOcrImage] = useState<string | null>(null);

  const [artResult, setArtResult] = useState([]);
  const [artLoading, setArtLoading] = useState(false);
  const [artImage, setArtImage] = useState<string | null>(null);

  const [recResult, setRecResult] = useState<any>(null);
  const [recLoading, setRecLoading] = useState(false);
  const [recUserId, setRecUserId] = useState('demo-user');

  const [nlQuery, setNlQuery] = useState('');
  const [nlResult, setNlResult] = useState([]);
  const [nlLoading, setNlLoading] = useState(false);

  const aiService = AIService.getInstance();

  // OCR Translation
  const handlePickOcrImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, base64: true });
    if (!result.canceled && result.assets && result.assets[0].base64) {
      setOcrImage(result.assets[0].uri);
      setOcrLoading(true);
      const ocr = await aiService.translateTextOCR(result.assets[0].base64, 'en');
      setOcrResult(ocr);
      setOcrLoading(false);
    }
  };

  // Art Style Matching
  const handlePickArtImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, base64: true });
    if (!result.canceled && result.assets && result.assets[0].base64) {
      setArtImage(result.assets[0].uri);
      setArtLoading(true);
      const matches = await aiService.findSimilarArtStyle(result.assets[0].base64);
      setArtResult(matches);
      setArtLoading(false);
    }
  };

  // Smart Recommendations
  const handleGetRecommendations = async () => {
    setRecLoading(true);
    const recs = await aiService.generateRecommendations(recUserId, []); // Pass empty library for demo
    setRecResult(recs);
    setRecLoading(false);
  };

  // Natural Language Search
  const handleNaturalLanguageSearch = async () => {
    setNlLoading(true);
    const results = await aiService.naturalLanguageSearch(nlQuery, []); // Pass empty library for demo
    setNlResult(results);
    setNlLoading(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>AI Core</Text>
        <Text style={styles.subtitle}>Intelligent Features</Text>

        {/* OCR Translation */}
        <TouchableOpacity style={styles.featureCard} onPress={handlePickOcrImage}>
          <Text style={styles.featureTitle}>OCR Translation</Text>
          <Text style={styles.featureDescription}>Translate manga text in real-time using AI</Text>
          {ocrImage && <Image source={{ uri: ocrImage }} style={{ width: 100, height: 140, marginTop: 8 }} />}
          {ocrLoading && <ActivityIndicator color="#fff" style={{ marginTop: 8 }} />}
          {ocrResult && (
            <View style={{ marginTop: 8 }}>
              <Text style={{ color: '#fff' }}>Original: {ocrResult.originalText}</Text>
              <Text style={{ color: '#fff' }}>Translated: {ocrResult.translatedText}</Text>
              <Text style={{ color: '#aaa' }}>Confidence: {Math.round(ocrResult.confidence * 100)}%</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Art Style Matching */}
        <TouchableOpacity style={styles.featureCard} onPress={handlePickArtImage}>
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
