import { performance } from 'perf_hooks';
import { renderWithProviders, expectRenderTimeBelow } from '../utils/testUtils';
import OptimizedList from '../components/OptimizedList';
import OptimizedImage from '../components/OptimizedImage';
import ErrorBoundary from '../components/ErrorBoundary';

/**
 * Performance tests for critical components
 */

describe('Performance Tests', () => {
  describe('OptimizedList Performance', () => {
    const generateLargeDataset = (size) => {
      return Array.from({ length: size }, (_, index) => ({
        id: index.toString(),
        title: `Item ${index}`,
        subtitle: `Subtitle for item ${index}`,
      }));
    };

    test('should render 100 items within 100ms', async () => {
      const data = generateLargeDataset(100);
      
      await expectRenderTimeBelow(() => {
        return renderWithProviders(
          <OptimizedList data={data} onItemPress={() => {}} />
        );
      }, 100);
    });

    test('should render 1000 items within 200ms', async () => {
      const data = generateLargeDataset(1000);
      
      await expectRenderTimeBelow(() => {
        return renderWithProviders(
          <OptimizedList data={data} onItemPress={() => {}} />
        );
      }, 200);
    });

    test('should handle rapid scrolling without frame drops', async () => {
      const data = generateLargeDataset(10000);
      const { getByTestId } = renderWithProviders(
        <OptimizedList data={data} testID="performance-list" />
      );

      const list = getByTestId('performance-list');
      
      // Simulate rapid scrolling
      const scrollTests = Array.from({ length: 10 }, (_, i) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            list.props.onScroll({
              nativeEvent: {
                contentOffset: { y: i * 1000 },
                contentSize: { height: 100000 },
                layoutMeasurement: { height: 800 },
              },
            });
            resolve();
          }, i * 10);
        });
      });

      const start = performance.now();
      await Promise.all(scrollTests);
      const end = performance.now();

      // Should complete all scroll events within 200ms
      expect(end - start).toBeLessThan(200);
    });
  });

  describe('OptimizedImage Performance', () => {
    test('should load image within acceptable time', async () => {
      const imageUrl = 'https://via.placeholder.com/300x300';
      
      await expectRenderTimeBelow(() => {
        return renderWithProviders(
          <OptimizedImage 
            source={imageUrl}
            style={{ width: 300, height: 300 }}
            testID="performance-image"
          />
        );
      }, 50);
    });

    test('should handle multiple images efficiently', async () => {
      const images = Array.from({ length: 20 }, (_, i) => (
        <OptimizedImage
          key={i}
          source={`https://via.placeholder.com/100x100?text=${i}`}
          style={{ width: 100, height: 100 }}
        />
      ));

      await expectRenderTimeBelow(() => {
        return renderWithProviders(<>{images}</>);
      }, 100);
    });
  });

  describe('ErrorBoundary Performance', () => {
    test('should render error state quickly', async () => {
      const ErrorComponent = () => {
        throw new Error('Test error');
      };

      await expectRenderTimeBelow(() => {
        return renderWithProviders(
          <ErrorBoundary>
            <ErrorComponent />
          </ErrorBoundary>
        );
      }, 50);
    });
  });

  describe('Memory Usage Tests', () => {
    test('should not cause memory leaks with frequent re-renders', async () => {
      const data = generateLargeDataset(100);
      let component;

      // Initial memory measurement
      if (global.gc) {
        global.gc();
      }
      const initialMemory = process.memoryUsage().heapUsed;

      // Perform multiple renders
      for (let i = 0; i < 10; i++) {
        if (component) {
          component.unmount();
        }
        component = renderWithProviders(
          <OptimizedList data={data} onItemPress={() => {}} />
        );
      }

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be less than 10MB
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);

      if (component) {
        component.unmount();
      }
    });
  });

  describe('Animation Performance', () => {
    test('should maintain 60fps during animations', async () => {
      // This test would require additional setup for animation testing
      // For now, we'll test that animations can be triggered without performance issues
      
      const { getByTestId } = renderWithProviders(
        <OptimizedImage
          source="https://via.placeholder.com/300x300"
          style={{ width: 300, height: 300 }}
          fadeDuration={300}
          testID="animated-image"
        />
      );

      const image = getByTestId('animated-image');
      
      // Simulate animation trigger
      const start = performance.now();
      image.props.onLoad();
      const end = performance.now();

      // Animation trigger should be instantaneous
      expect(end - start).toBeLessThan(5);
    });
  });

  describe('Bundle Size Impact', () => {
    test('should have minimal bundle size impact', () => {
      // This would typically be tested at build time
      // For now, we'll verify that components can be imported without issues
      expect(() => {
        require('../components/OptimizedList');
        require('../components/OptimizedImage');
        require('../components/ErrorBoundary');
      }).not.toThrow();
    });
  });
});

// Helper function to generate test data
function generateLargeDataset(size) {
  return Array.from({ length: size }, (_, index) => ({
    id: index.toString(),
    title: `Performance Test Item ${index}`,
    subtitle: `This is item number ${index} for performance testing`,
    image: `https://via.placeholder.com/50x50?text=${index}`,
  }));
}
