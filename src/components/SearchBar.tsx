import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  Animated,
  Keyboard,
  ViewStyle,
} from 'react-native';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onClear?: () => void;
  initialValue?: string;
  style?: ViewStyle;
  autoFocus?: boolean;
  showFilterButton?: boolean;
  onFilterPress?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  onSearch,
  onClear,
  initialValue = '',
  style,
  autoFocus = false,
  showFilterButton = false,
  onFilterPress,
}) => {
  const [query, setQuery] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const animatedWidth = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animate width when focus changes
    Animated.timing(animatedWidth, {
      toValue: isFocused ? 0.85 : 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, animatedWidth]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleClear = () => {
    setQuery('');
    if (onClear) {
      onClear();
    }
    inputRef.current?.focus();
  };

  const handleCancel = () => {
    Keyboard.dismiss();
    setIsFocused(false);
    if (query === '' && onClear) {
      onClear();
    }
  };

  const handleSubmit = () => {
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.searchContainer,
          { width: animatedWidth.interpolate({ inputRange: [0, 1], outputRange: ['85%', '100%'] }) },
        ]}
      >
        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor="#999"
            value={query}
            onChangeText={setQuery}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onSubmitEditing={handleSubmit}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus={autoFocus}
            clearButtonMode="never"
          />
          {query.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
          {showFilterButton && (
            <TouchableOpacity 
              style={styles.filterButton} 
              onPress={onFilterPress}
              testID="filter-button"
            >
              <Text style={styles.filterButtonText}>Filter</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {isFocused && (
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchContainer: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2c2c2c',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    paddingVertical: 8,
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    color: '#999',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginLeft: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  cancelButtonText: {
    color: '#007BFF',
    fontSize: 16,
  },
  filterButton: {
    marginLeft: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#444',
    borderRadius: 4,
  },
  filterButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
});

export default SearchBar;