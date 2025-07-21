import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';

interface CardProps {
  title: string;
  imageUrl: string;
  onPress: () => void;
  tags?: string[];
}

const Card: React.FC<CardProps> = ({ title, imageUrl, onPress, tags }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <FastImage
        style={styles.image}
        source={{
          uri: imageUrl,
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        {tags && (
          <View style={styles.tagsContainer}>
            {tags.slice(0, 3).map(tag => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#2c2c2c',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  image: {
    width: '100%',
    height: 180,
  },
  content: {
    padding: 12,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#444',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
});

export default Card;

