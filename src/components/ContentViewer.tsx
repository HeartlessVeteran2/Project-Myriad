import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { MangaChapter, AnimeEpisode } from '../types';

const { width, height } = Dimensions.get('window');

type ContentType = 'manga' | 'anime';

interface ContentViewerProps {
  contentType: ContentType;
  title: string;
  content: MangaChapter | AnimeEpisode;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  readingDirection?: 'ltr' | 'rtl' | 'vertical';
  onProgressUpdate: (progress: number) => void;
}

const ContentViewer: React.FC<ContentViewerProps> = ({
  contentType,
  title,
  content,
  onClose,
  onNext,
  onPrevious,
  readingDirection = 'ltr',
  onProgressUpdate,
}) => {
  const [showControls, setShowControls] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  // Determine if we're viewing manga or anime
  const isManga = contentType === 'manga';
  const mangaChapter = isManga ? (content as MangaChapter) : null;
  const animeEpisode = !isManga ? (content as AnimeEpisode) : null;

  // Get the content items (pages for manga, video for anime)
  const contentItems = isManga ? mangaChapter?.pages || [] : [animeEpisode?.videoUrl || animeEpisode?.localPath || ''];
  
  // Set up the flatlist scroll direction based on reading direction
  const isHorizontal = readingDirection !== 'vertical';
  const reverseOrder = readingDirection === 'rtl';

  useEffect(() => {
    // Hide controls after 3 seconds
    const timer = setTimeout(() => {
      setShowControls(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showControls]);

  useEffect(() => {
    // Reset to first item when content changes
    setCurrentIndex(0);
    setLoading(true);
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: false });
    }
  }, [content]);

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset[isHorizontal ? 'x' : 'y'];
    const itemSize = isHorizontal ? width : height;
    const index = Math.round(scrollPosition / itemSize);
    
    if (index !== currentIndex) {
      setCurrentIndex(index);
      
      // Calculate progress percentage
      const progress = (index + 1) / contentItems.length;
      onProgressUpdate(progress);
    }
  };

  const renderMangaPage = ({ item, index }: { item: string; index: number }) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={[styles.pageContainer, { width, height: isHorizontal ? height : undefined }]}
        onPress={toggleControls}
      >
        <FastImage
          source={{ uri: item, priority: FastImage.priority.normal }}
          style={styles.pageImage}
          resizeMode={FastImage.resizeMode.contain}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
        />
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#007BFF" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // For anime, we would render a video player component here
  // This is a placeholder for now
  const renderAnimePlayer = () => {
    return (
      <View style={styles.videoContainer}>
        <Text style={styles.placeholderText}>
          Video Player Placeholder
          {'\n'}
          {animeEpisode?.title || 'Episode'}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={!showControls} />
      
      {/* Content Viewer */}
      {isManga ? (
        <FlatList
          ref={flatListRef}
          data={reverseOrder ? [...contentItems].reverse() : contentItems}
          renderItem={renderMangaPage}
          keyExtractor={(_, index) => `page-${index}`}
          horizontal={isHorizontal}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />
      ) : (
        renderAnimePlayer()
      )}
      
      {/* Controls Overlay */}
      {showControls && (
        <View style={styles.controlsOverlay}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
            <View style={styles.spacer} />
          </View>
          
          <View style={styles.navigationControls}>
            {onPrevious && (
              <TouchableOpacity onPress={onPrevious} style={styles.navButton}>
                <Text style={styles.navButtonText}>Previous</Text>
              </TouchableOpacity>
            )}
            
            <View style={styles.progressIndicator}>
              <Text style={styles.progressText}>
                {isManga 
                  ? `${currentIndex + 1}/${contentItems.length}`
                  : `${Math.floor((animeEpisode?.watchProgress || 0) * 100)}%`
                }
              </Text>
            </View>
            
            {onNext && (
              <TouchableOpacity onPress={onNext} style={styles.navButton}>
                <Text style={styles.navButtonText}>Next</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  pageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageImage: {
    width: '100%',
    height: '100%',
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
  },
  placeholderText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
  },
  title: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    textAlign: 'center',
  },
  spacer: {
    width: 40,
  },
  navigationControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  navButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#007BFF',
    borderRadius: 4,
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressIndicator: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
  },
  progressText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});

export default ContentViewer;