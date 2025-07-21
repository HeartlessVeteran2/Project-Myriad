import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Modal,
  SafeAreaView,
} from 'react-native';

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
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  visible,
  onClose,
  onApply,
  categories,
  initialFilters = {},
  contentType = 'all',
}) => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [contentTypeFilter, setContentTypeFilter] = useState<'manga' | 'anime' | 'all'>(contentType);

  const handleReset = () => {
    setFilters({});
    setContentTypeFilter('all');
  };

  const handleApply = () => {
    const appliedFilters = { ...filters, contentType: contentTypeFilter };
    onApply(appliedFilters);
    onClose();
  };

  const toggleOption = (categoryId: string, optionId: string) => {
    setFilters(prevFilters => {
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