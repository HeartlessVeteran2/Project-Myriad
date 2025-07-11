# 🔌 Extension Development Guide

## Overview

Project Myriad's extension system allows developers to integrate new manga and anime sources seamlessly. Extensions are JavaScript modules that follow a standardized API, enabling users to access content from various sources while maintaining security and performance.

## Extension Architecture

### Core Concepts

- **Sources**: Individual manga/anime providers (e.g., MangaDex, Crunchyroll)
- **Extensions**: Packages that can contain multiple sources
- **Manifest**: Metadata file describing the extension
- **Sandbox**: Isolated execution environment for security
- **API**: Standardized interface for source interaction

### Extension Types

1. **Manga Sources**: For manga reading sites and APIs
2. **Anime Sources**: For anime streaming platforms
3. **Light Novel Sources**: For text-based content
4. **Utility Extensions**: Tools and enhancers

## Getting Started

### Development Environment Setup

```bash
# Clone the extension template
git clone https://github.com/HeartlessVeteran2/myriad-extension-template.git my-extension
cd my-extension

# Install dependencies
npm install

# Start development server
npm run dev
```

### Extension Structure

```
my-extension/
├── manifest.json          # Extension metadata
├── src/
│   ├── index.js           # Main entry point
│   ├── sources/
│   │   ├── manga-source.js
│   │   └── anime-source.js
│   ├── utils/
│   │   ├── parser.js
│   │   └── helpers.js
│   └── assets/
│       ├── icon.png
│       └── banner.png
├── tests/
│   ├── sources.test.js
│   └── integration.test.js
├── docs/
│   └── README.md
└── package.json
```

## Manifest File

The `manifest.json` file defines your extension's metadata:

```json
{
  "manifest_version": 1,
  "name": "Example Manga Source",
  "version": "1.0.0",
  "description": "Access manga from Example Site",
  "author": "Your Name",
  "homepage": "https://github.com/yourusername/example-extension",
  "icon": "assets/icon.png",
  "banner": "assets/banner.png",

  "sources": [
    {
      "id": "example-manga",
      "name": "Example Manga",
      "type": "manga",
      "language": "en",
      "base_url": "https://example-manga.com",
      "version": "1.0.0",
      "nsfw": false
    }
  ],

  "permissions": ["network", "storage"],

  "content_rating": "teen",
  "update_url": "https://your-server.com/extensions/updates.json",

  "dependencies": {
    "myriad_api": ">=1.0.0"
  },

  "settings": {
    "user_agent": {
      "type": "string",
      "default": "Myriad/1.0",
      "description": "User agent for requests"
    },
    "preferred_quality": {
      "type": "select",
      "options": ["low", "medium", "high"],
      "default": "high",
      "description": "Preferred image quality"
    }
  }
}
```

## Source Implementation

### Manga Source Interface

Every manga source must implement the following interface:

```javascript
// src/sources/manga-source.js
import { MangaSource } from '@myriad/extension-api';

export class ExampleMangaSource extends MangaSource {
  constructor() {
    super();
    this.baseUrl = 'https://example-manga.com';
    this.name = 'Example Manga';
    this.id = 'example-manga';
    this.language = 'en';
  }

  /**
   * Search for manga
   * @param {string} query - Search query
   * @param {number} page - Page number (1-based)
   * @param {Object} filters - Additional filters
   * @returns {Promise<SearchResult[]>}
   */
  async search(query, page = 1, filters = {}) {
    try {
      const url = `${this.baseUrl}/search?q=${encodeURIComponent(query)}&page=${page}`;
      const response = await this.request(url);
      const html = await response.text();

      return this.parseSearchResults(html);
    } catch (error) {
      throw new Error(`Search failed: ${error.message}`);
    }
  }

  /**
   * Get manga details
   * @param {string} mangaId - Unique manga identifier
   * @returns {Promise<MangaDetails>}
   */
  async getMangaDetails(mangaId) {
    const url = `${this.baseUrl}/manga/${mangaId}`;
    const response = await this.request(url);
    const html = await response.text();

    return this.parseMangaDetails(html);
  }

  /**
   * Get chapter list
   * @param {string} mangaId - Manga identifier
   * @returns {Promise<Chapter[]>}
   */
  async getChapterList(mangaId) {
    const url = `${this.baseUrl}/manga/${mangaId}/chapters`;
    const response = await this.request(url);
    const html = await response.text();

    return this.parseChapterList(html);
  }

  /**
   * Get chapter pages
   * @param {string} mangaId - Manga identifier
   * @param {string} chapterId - Chapter identifier
   * @returns {Promise<Page[]>}
   */
  async getChapterPages(mangaId, chapterId) {
    const url = `${this.baseUrl}/manga/${mangaId}/chapter/${chapterId}`;
    const response = await this.request(url);
    const html = await response.text();

    return this.parseChapterPages(html);
  }

  /**
   * Get popular manga
   * @param {number} page - Page number
   * @returns {Promise<SearchResult[]>}
   */
  async getPopular(page = 1) {
    const url = `${this.baseUrl}/popular?page=${page}`;
    const response = await this.request(url);
    const html = await response.text();

    return this.parseSearchResults(html);
  }

  /**
   * Get latest manga updates
   * @param {number} page - Page number
   * @returns {Promise<SearchResult[]>}
   */
  async getLatest(page = 1) {
    const url = `${this.baseUrl}/latest?page=${page}`;
    const response = await this.request(url);
    const html = await response.text();

    return this.parseSearchResults(html);
  }

  /**
   * Get available filters for search
   * @returns {FilterGroup[]}
   */
  getFilters() {
    return [
      {
        name: 'Genres',
        key: 'genres',
        type: 'checkbox_group',
        options: [
          { value: 'action', label: 'Action' },
          { value: 'romance', label: 'Romance' },
          { value: 'comedy', label: 'Comedy' },
        ],
      },
      {
        name: 'Status',
        key: 'status',
        type: 'select',
        options: [
          { value: 'ongoing', label: 'Ongoing' },
          { value: 'completed', label: 'Completed' },
          { value: 'hiatus', label: 'On Hiatus' },
        ],
      },
      {
        name: 'Year',
        key: 'year',
        type: 'range',
        min: 1990,
        max: new Date().getFullYear(),
      },
    ];
  }

  // Parser helper methods
  parseSearchResults(html) {
    const $ = this.parseHTML(html);
    const results = [];

    $('.manga-item').each((i, element) => {
      const $element = $(element);
      results.push({
        id: $element.attr('data-id'),
        title: $element.find('.title').text().trim(),
        cover: $element.find('img').attr('src'),
        url: $element.find('a').attr('href'),
        latest_chapter: $element.find('.latest-chapter').text().trim(),
        rating: parseFloat($element.find('.rating').text()) || 0,
        tags: $element
          .find('.tags .tag')
          .map((i, tag) => $(tag).text())
          .get(),
      });
    });

    return results;
  }

  parseMangaDetails(html) {
    const $ = this.parseHTML(html);

    return {
      title: $('.manga-title').text().trim(),
      alternativeTitles: $('.alt-titles .title')
        .map((i, el) => $(el).text())
        .get(),
      description: $('.description').text().trim(),
      cover: $('.cover img').attr('src'),
      status: $('.status').text().trim(),
      author: $('.author').text().trim(),
      artist: $('.artist').text().trim(),
      genres: $('.genres .genre')
        .map((i, el) => $(el).text())
        .get(),
      year: parseInt($('.year').text()) || null,
      rating: parseFloat($('.rating').text()) || 0,
      views: parseInt($('.views').text().replace(/\D/g, '')) || 0,
    };
  }

  parseChapterList(html) {
    const $ = this.parseHTML(html);
    const chapters = [];

    $('.chapter-item').each((i, element) => {
      const $element = $(element);
      chapters.push({
        id: $element.attr('data-id'),
        number: parseFloat($element.find('.chapter-number').text()) || 0,
        title: $element.find('.chapter-title').text().trim(),
        url: $element.find('a').attr('href'),
        date: $element.find('.date').text().trim(),
        views: parseInt($element.find('.views').text().replace(/\D/g, '')) || 0,
      });
    });

    return chapters.reverse(); // Most sources list newest first
  }

  parseChapterPages(html) {
    const $ = this.parseHTML(html);
    const pages = [];

    $('.page-img').each((i, element) => {
      const $element = $(element);
      pages.push({
        page: i + 1,
        url: $element.attr('src') || $element.attr('data-src'),
        width: parseInt($element.attr('width')) || null,
        height: parseInt($element.attr('height')) || null,
      });
    });

    return pages;
  }
}
```

### Anime Source Interface

```javascript
// src/sources/anime-source.js
import { AnimeSource } from '@myriad/extension-api';

export class ExampleAnimeSource extends AnimeSource {
  constructor() {
    super();
    this.baseUrl = 'https://example-anime.com';
    this.name = 'Example Anime';
    this.id = 'example-anime';
    this.language = 'en';
  }

  async search(query, page = 1, filters = {}) {
    // Implementation similar to manga source
  }

  async getAnimeDetails(animeId) {
    // Get anime information
  }

  async getEpisodeList(animeId) {
    // Get available episodes
  }

  async getEpisodeSources(animeId, episodeId) {
    // Get video sources for episode
    return [
      {
        url: 'https://example.com/video.m3u8',
        quality: '720p',
        type: 'hls',
        headers: {
          Referer: this.baseUrl,
        },
      },
    ];
  }

  async getSubtitles(animeId, episodeId) {
    // Get subtitle tracks
    return [
      {
        url: 'https://example.com/subs.vtt',
        language: 'en',
        label: 'English',
      },
    ];
  }
}
```

## API Reference

### Base Classes

#### Source Class

```javascript
import { Source } from '@myriad/extension-api';

class MySource extends Source {
  // HTTP request with built-in error handling
  async request(url, options = {}) {
    return await this.fetch(url, {
      headers: {
        'User-Agent': this.getUserAgent(),
        ...options.headers,
      },
      ...options,
    });
  }

  // Parse HTML with cheerio-like interface
  parseHTML(html) {
    return (this.$ = this.cheerio.load(html));
  }

  // Get user agent from settings
  getUserAgent() {
    return this.getSetting('user_agent', 'Myriad/1.0');
  }

  // Get extension setting
  getSetting(key, defaultValue) {
    return this.settings.get(key, defaultValue);
  }

  // Store data locally
  async store(key, value) {
    return await this.storage.set(key, value);
  }

  // Retrieve stored data
  async retrieve(key, defaultValue = null) {
    return await this.storage.get(key, defaultValue);
  }
}
```

### Data Types

#### SearchResult

```javascript
{
  id: string,           // Unique identifier
  title: string,        // Display title
  cover: string,        // Cover image URL
  url: string,          // Source URL
  latest_chapter?: string,
  rating?: number,      // 0-10 rating
  tags?: string[],      // Genre/category tags
  status?: string,      // ongoing, completed, etc.
  description?: string
}
```

#### MangaDetails

```javascript
{
  title: string,
  alternativeTitles?: string[],
  description: string,
  cover: string,
  status: string,       // ongoing, completed, hiatus
  author?: string,
  artist?: string,
  genres: string[],
  year?: number,
  rating?: number,
  views?: number,
  chapters?: Chapter[]
}
```

#### Chapter

```javascript
{
  id: string,
  number: number,
  title?: string,
  url: string,
  date?: string,
  views?: number,
  pages?: Page[]
}
```

#### Page

```javascript
{
  page: number,
  url: string,
  width?: number,
  height?: number,
  headers?: Object      // Required headers for image request
}
```

## Advanced Features

### Authentication

Some sources require user authentication:

```javascript
class AuthenticatedSource extends MangaSource {
  constructor() {
    super();
    this.requiresAuth = true;
  }

  async authenticate(credentials) {
    const response = await this.request('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();

    if (data.token) {
      await this.store('auth_token', data.token);
      return true;
    }

    throw new Error('Authentication failed');
  }

  async request(url, options = {}) {
    const token = await this.retrieve('auth_token');

    if (token) {
      options.headers = {
        Authorization: `Bearer ${token}`,
        ...options.headers,
      };
    }

    const response = await super.request(url, options);

    // Handle token expiration
    if (response.status === 401) {
      await this.store('auth_token', null);
      throw new Error('Authentication required');
    }

    return response;
  }
}
```

### Rate Limiting

Implement rate limiting to respect source servers:

```javascript
class RateLimitedSource extends MangaSource {
  constructor() {
    super();
    this.requestQueue = [];
    this.lastRequest = 0;
    this.minDelay = 1000; // 1 second between requests
  }

  async request(url, options = {}) {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequest;

    if (timeSinceLastRequest < this.minDelay) {
      await this.delay(this.minDelay - timeSinceLastRequest);
    }

    this.lastRequest = Date.now();
    return await super.request(url, options);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### Caching

Implement caching for better performance:

```javascript
class CachedSource extends MangaSource {
  async getMangaDetails(mangaId) {
    const cacheKey = `manga_details_${mangaId}`;
    const cached = await this.retrieve(cacheKey);

    if (cached && Date.now() - cached.timestamp < 3600000) {
      // 1 hour
      return cached.data;
    }

    const details = await super.getMangaDetails(mangaId);

    await this.store(cacheKey, {
      data: details,
      timestamp: Date.now(),
    });

    return details;
  }
}
```

### Image Processing

Handle different image formats and optimization:

```javascript
class ImageOptimizedSource extends MangaSource {
  async getChapterPages(mangaId, chapterId) {
    const pages = await super.getChapterPages(mangaId, chapterId);

    return pages.map(page => ({
      ...page,
      url: this.optimizeImageUrl(page.url),
      headers: {
        Referer: this.baseUrl,
        'User-Agent': this.getUserAgent(),
      },
    }));
  }

  optimizeImageUrl(url) {
    const quality = this.getSetting('preferred_quality', 'high');
    const qualityMap = {
      low: 'q_30,f_auto',
      medium: 'q_70,f_auto',
      high: 'q_90,f_auto',
    };

    // Cloudinary-style optimization
    return url.replace('/upload/', `/upload/${qualityMap[quality]}/`);
  }
}
```

## Testing

### Unit Tests

```javascript
// tests/sources.test.js
import { ExampleMangaSource } from '../src/sources/manga-source.js';

describe('ExampleMangaSource', () => {
  let source;

  beforeEach(() => {
    source = new ExampleMangaSource();
  });

  test('should search for manga', async () => {
    const results = await source.search('one piece');

    expect(results).toBeDefined();
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);

    const firstResult = results[0];
    expect(firstResult).toHaveProperty('id');
    expect(firstResult).toHaveProperty('title');
    expect(firstResult).toHaveProperty('cover');
  });

  test('should get manga details', async () => {
    const details = await source.getMangaDetails('one-piece');

    expect(details).toBeDefined();
    expect(details).toHaveProperty('title');
    expect(details).toHaveProperty('description');
    expect(details).toHaveProperty('cover');
    expect(details).toHaveProperty('genres');
    expect(Array.isArray(details.genres)).toBe(true);
  });

  test('should get chapter list', async () => {
    const chapters = await source.getChapterList('one-piece');

    expect(chapters).toBeDefined();
    expect(Array.isArray(chapters)).toBe(true);

    if (chapters.length > 0) {
      const firstChapter = chapters[0];
      expect(firstChapter).toHaveProperty('id');
      expect(firstChapter).toHaveProperty('number');
      expect(firstChapter).toHaveProperty('url');
    }
  });

  test('should get chapter pages', async () => {
    const pages = await source.getChapterPages('one-piece', 'chapter-1');

    expect(pages).toBeDefined();
    expect(Array.isArray(pages)).toBe(true);

    if (pages.length > 0) {
      const firstPage = pages[0];
      expect(firstPage).toHaveProperty('page');
      expect(firstPage).toHaveProperty('url');
      expect(firstPage.page).toBeGreaterThan(0);
    }
  });
});
```

### Integration Tests

```javascript
// tests/integration.test.js
import { installExtension, loadExtension } from '@myriad/extension-loader';

describe('Extension Integration', () => {
  test('should install and load extension', async () => {
    const extensionPath = './dist/extension.zip';

    // Install extension
    const installResult = await installExtension(extensionPath);
    expect(installResult.success).toBe(true);

    // Load extension
    const extension = await loadExtension('example-manga');
    expect(extension).toBeDefined();
    expect(extension.sources).toBeDefined();
    expect(extension.sources.length).toBeGreaterThan(0);
  });
});
```

## Publishing

### Building Extension

```bash
# Build extension for distribution
npm run build

# This creates dist/extension.zip ready for distribution
```

### Extension Marketplace

To publish your extension to the Myriad Extension Marketplace:

1. **Test thoroughly**: Ensure all functionality works correctly
2. **Documentation**: Include comprehensive README and examples
3. **Submit for review**: Create pull request to marketplace repository
4. **Code review**: Address any feedback from reviewers
5. **Publication**: Extension becomes available to all users

### Submission Guidelines

- **Code Quality**: Follow ESLint rules and best practices
- **Performance**: Implement rate limiting and caching
- **Security**: Validate all inputs and handle errors gracefully
- **Documentation**: Include clear setup and usage instructions
- **Testing**: Provide comprehensive test coverage
- **Licensing**: Include appropriate license (GPL-compatible recommended)

## Best Practices

### Performance

1. **Rate Limiting**: Always implement delays between requests
2. **Caching**: Cache responses when appropriate
3. **Lazy Loading**: Only load data when needed
4. **Image Optimization**: Support multiple quality levels

### Security

1. **Input Validation**: Validate all user inputs
2. **Error Handling**: Never expose sensitive information in errors
3. **HTTPS**: Always use HTTPS when available
4. **Headers**: Set appropriate request headers

### User Experience

1. **Progress Feedback**: Provide progress updates for long operations
2. **Error Messages**: Give clear, actionable error messages
3. **Offline Support**: Cache content for offline reading when possible
4. **Settings**: Expose relevant configuration options

### Maintenance

1. **Version Control**: Use semantic versioning
2. **Changelog**: Maintain detailed changelog
3. **Backwards Compatibility**: Avoid breaking changes in minor updates
4. **Monitoring**: Monitor for source website changes

This guide provides everything needed to create powerful, reliable extensions for Project Myriad. For additional help, check the [example extensions repository](https://github.com/HeartlessVeteran2/myriad-extensions) or join our [Discord community](https://discord.gg/project-myriad).
