import React, { useState, useCallback, useMemo } from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';

const OptimizedImage = ({
  source,
  style,
  resizeMode = 'cover',
  placeholder,
  onLoad,
  onError,
  fadeDuration = 300,
  cachePolicy = 'memory-disk',
  priority = 'normal',
  ...props
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleLoad = useCallback((event) => {
    setLoading(false);
    setLoaded(true);
    onLoad?.(event);
  }, [onLoad]);

  const handleError = useCallback((event) => {
    setLoading(false);
    setError(true);
    onError?.(event);
  }, [onError]);

  const imageSource = useMemo(() => {
    if (typeof source === 'string') {
      return {
        uri: source,
        cache: cachePolicy,
        priority: priority
      };
    }
    return source;
  }, [source, cachePolicy, priority]);

  const containerStyle = useMemo(() => [
    styles.container,
    style
  ], [style]);

  const imageStyle = useMemo(() => [
    styles.image,
    style,
    {
      opacity: loaded ? 1 : 0
    }
  ], [style, loaded]);

  return (
    <View style={containerStyle}>
      {loading && !error && (
        <View style={styles.loadingContainer}>
          {placeholder || <ActivityIndicator size="small" color="#999999" />}
        </View>
      )}
      
      {error && placeholder && (
        <View style={styles.errorContainer}>
          {placeholder}
        </View>
      )}
      
      {!error && (
        <Image
          {...props}
          source={imageSource}
          style={imageStyle}
          resizeMode={resizeMode}
          onLoad={handleLoad}
          onError={handleError}
          fadeDuration={fadeDuration}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});

export default React.memo(OptimizedImage);
