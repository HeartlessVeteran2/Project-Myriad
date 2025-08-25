
          {/* Status Filter */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Status</Text>
            <View style={styles.chipContainer}>
              {statusOptions.map(status => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.chip,
                    localFilters.status.includes(status) && styles.chipSelected
                  ]}
                  onPress={() => handleStatusToggle(status)}
                >
                  <Text style={[
                    styles.chipText,
                    localFilters.status.includes(status) && styles.chipTextSelected
                  ]}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Rating Filter */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Minimum Rating</Text>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map(rating => (
                <TouchableOpacity
                  key={rating}
                  style={[
                    styles.ratingButton,
                    localFilters.rating >= rating && styles.ratingButtonSelected
                  ]}
                  onPress={() => handleRatingChange(rating)}
                >
                  <Text style={[
                    styles.ratingText,
                    localFilters.rating >= rating && styles.ratingTextSelected
                  ]}>
                    ⭐
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
} from 'react-native';
import { MangaStatus, AnimeStatus } from '../types';

export interface FilterOption {
  id: string;
  label: string;
}

export interface FilterCategory {
  id: string;
  title: string;
  multiSelect: boolean;
  options: FilterOption[];
}

export interface FilterState {
  [categoryId: string]: string[] | string;
}

interface FilterPanelProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  categories: FilterCategory[];
  initialFilters?: FilterState;
  contentType?: 'manga' | 'anime' | 'all';
  filters: {
    genre: string[];
    status: string[];
    rating: number;
  };
  onFiltersChange: (filters: any) => void;
  availableGenres: string[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  visible,
  onClose,
  onApply,
  categories,
  initialFilters = {},
  contentType = 'all',
  filters,
  onFiltersChange,
  availableGenres,
}) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [contentTypeFilter, setContentTypeFilter] = useState<'manga' | 'anime' | 'all'>(contentType);

  const statusOptions = [
    MangaStatus.ONGOING,
    MangaStatus.COMPLETED,
    MangaStatus.HIATUS,
    AnimeStatus.UPCOMING,
  ];

  const handleReset = () => {
    setLocalFilters({ genre: [], status: [], rating: 0 });
    setContentTypeFilter('all');
  };

  const handleApply = () => {
    const appliedFilters = { ...localFilters, contentType: contentTypeFilter };
    onApply(appliedFilters);
    onClose();
  };

  const toggleOption = (categoryId: string, optionId: string) => {
    setLocalFilters(prevFilters => {
      const category = categories.find(c => c.id === categoryId);
      
      if (!category) return prevFilters;
      
      if (category.multiSelect) {
        // Handle multi-select categories (arrays)
        const currentSelections = (prevFilters[categoryId] as string[]) || [];
        
        if (currentSelections.includes(optionId)) {
          // Remove if already selected
          return {
            ...prevFilters,
            [categoryId]: currentSelections.filter(id => id !== optionId),
          };
        } else {
          // Add if not selected
          return {
            ...prevFilters,
            [categoryId]: [...currentSelections, optionId],
          };
        }
      } else {
        // Handle single-select categories (strings)
        if (prevFilters[categoryId] === optionId) {
          // Deselect if already selected
          const { [categoryId]: _, ...rest } = prevFilters;
          return rest;
        } else {
          // Select new option
          return {
            ...prevFilters,
            [categoryId]: optionId,
          };
        }
      }
    });
  };

  const isOptionSelected = (categoryId: string, optionId: string) => {
    const category = categories.find(c => c.id === categoryId);
    
    if (!category) return false;
    
    if (category.multiSelect) {
      const selections = (filters[categoryId] as string[]) || [];
      return selections.includes(optionId);
    } else {
      return filters[categoryId] === optionId;
    }
  };

  const handleGenreToggle = (genre: string) => {
    const newGenres = localFilters.genre.includes(genre)
      ? localFilters.genre.filter(g => g !== genre)
      : [...localFilters.genre, genre];

    const newFilters = { ...localFilters, genre: newGenres };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  chipSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  chipText: {
    fontSize: 14,
    color: '#666',
  },
  chipTextSelected: {
    color: 'white',
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  ratingButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  ratingButtonSelected: {
    backgroundColor: '#007AFF',
  },
  ratingText: {
    fontSize: 18,
  },
  ratingTextSelected: {
    color: 'white',
  },

  const handleStatusToggle = (status: string) => {
    const newStatus = localFilters.status.includes(status)

      ? localFilters.status.filter(s => s !== status)
      : [...localFilters.status, status];

    const newFilters = { ...localFilters, status: newStatus };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleRatingChange = (rating: number) => {
    const newFilters = { ...localFilters, rating };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = { genre: [], status: [], rating: 0 };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const renderContentTypeSelector = () => {
    return (
      <View style={styles.contentTypeContainer}>
        <Text style={styles.categoryTitle}>Content Type</Text>
        <View style={styles.contentTypeButtons}>
          <TouchableOpacity
            style={[
              styles.contentTypeButton,
              contentTypeFilter === 'all' && styles.contentTypeButtonSelected,
            ]}
            onPress={() => setContentTypeFilter('all')}
          >
            <Text
              style={[
                styles.contentTypeButtonText,
                contentTypeFilter === 'all' && styles.contentTypeButtonTextSelected,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.contentTypeButton,
              contentTypeFilter === 'manga' && styles.contentTypeButtonSelected,
            ]}
            onPress={() => setContentTypeFilter('manga')}
          >
            <Text
              style={[
                styles.contentTypeButtonText,
                contentTypeFilter === 'manga' && styles.contentTypeButtonTextSelected,
              ]}
            >
              Manga
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.contentTypeButton,
              contentTypeFilter === 'anime' && styles.contentTypeButtonSelected,
            ]}
            onPress={() => setContentTypeFilter('anime')}
          >
            <Text
              style={[
                styles.contentTypeButtonText,
                contentTypeFilter === 'anime' && styles.contentTypeButtonTextSelected,
              ]}
            >
              Anime
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Filter Content</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView}>
          {renderContentTypeSelector()}

          {categories.map(category => (
            <View key={category.id} style={styles.categoryContainer}>
              <Text style={styles.categoryTitle}>{category.title}</Text>
              <View style={styles.optionsContainer}>
                {category.options.map(option => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.optionButton,
                      isOptionSelected(category.id, option.id) && styles.optionButtonSelected,
                    ]}
                    onPress={() => toggleOption(category.id, option.id)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isOptionSelected(category.id, option.id) && styles.optionTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          {/* Genre Filter */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Genres</Text>
            <View style={styles.chipContainer}>
              {availableGenres.map(genre => (
                <TouchableOpacity
                  key={genre}
                  style={[
                    styles.chip,
                    localFilters.genre.includes(genre) && styles.chipSelected
                  ]}
                  onPress={() => handleGenreToggle(genre)}
                >
                  <Text style={[
                    styles.chipText,
                    localFilters.genre.includes(genre) && styles.chipTextSelected
                  ]}>
                    {genre}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  contentTypeContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  contentTypeButtons: {
    flexDirection: 'row',
    marginTop: 8,
  },
  contentTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginRight: 8,
    backgroundColor: '#2c2c2c',
  },
  contentTypeButtonSelected: {
    backgroundColor: '#007BFF',
  },
  contentTypeButtonText: {
    color: '#CCCCCC',
    fontSize: 14,
  },
  contentTypeButtonTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  categoryContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#2c2c2c',
  },
  optionButtonSelected: {
    backgroundColor: '#007BFF',
  },
  optionText: {
    color: '#CCCCCC',
    fontSize: 14,
  },
  optionTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  resetButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: '#444',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  applyButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: '#007BFF',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default FilterPanel;