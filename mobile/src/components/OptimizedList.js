import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

const OptimizedList = ({ data, onItemPress, renderItem }) => {
  const { isDark } = useTheme();

  const keyExtractor = React.useCallback((item, index) => {
    return item.id ? item.id.toString() : index.toString();
  }, []);

  const getItemLayout = React.useCallback((data, index) => ({
    length: 60, // Fixed item height for better performance
    offset: 60 * index,
    index,
  }), []);

  const renderListItem = React.useCallback(({ item, index }) => {
    if (renderItem) {
      return renderItem({ item, index });
    }

    return (
      <TouchableOpacity
        style={[styles.listItem, isDark && styles.listItemDark]}
        onPress={() => onItemPress?.(item, index)}
        activeOpacity={0.7}
      >
        <Text style={[styles.itemText, isDark && styles.itemTextDark]}>
          {item.title || item.name || `Item ${index + 1}`}
        </Text>
        {item.subtitle && (
          <Text style={[styles.subtitleText, isDark && styles.subtitleTextDark]}>
            {item.subtitle}
          </Text>
        )}
      </TouchableOpacity>
    );
  }, [renderItem, onItemPress, isDark]);

  return (
    <FlatList
      data={data}
      renderItem={renderListItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      initialNumToRender={10}
      windowSize={10}
      legacyImplementation={false}
      disableVirtualization={false}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  listItem: {
    height: 60,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
    justifyContent: 'center',
  },
  listItemDark: {
    backgroundColor: '#2c2c2c',
    borderBottomColor: '#404040',
  },
  itemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 2,
  },
  itemTextDark: {
    color: '#ffffff',
  },
  subtitleText: {
    fontSize: 14,
    color: '#666666',
  },
  subtitleTextDark: {
    color: '#aaaaaa',
  },
});

export default React.memo(OptimizedList);
