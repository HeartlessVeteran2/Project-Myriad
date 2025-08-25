import React from 'react';
import { render } from '@testing-library/react-native';
import ProgressBar from '../../src/components/ProgressBar';

describe('ProgressBar Component', () => {
  it('renders correctly with default props', () => {
    const { getByTestId } = render(<ProgressBar progress={0.5} testID="progress-bar" />);
    expect(getByTestId('progress-bar')).toBeTruthy();
  });

  it('displays correct progress percentage', () => {
    const { getByText } = render(
      <ProgressBar progress={0.75} showPercentage={true} />
    );
    expect(getByText('75%')).toBeTruthy();
  });

  it('displays label when provided', () => {
    const { getByText } = render(
      <ProgressBar progress={0.5} label="Loading..." />
    );
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('handles progress values outside 0-1 range', () => {
    const { getByText: getByTextNegative } = render(
      <ProgressBar progress={-0.5} showPercentage={true} />
    );
    expect(getByTextNegative('0%')).toBeTruthy();

    const { getByText: getByTextOver } = render(
      <ProgressBar progress={1.5} showPercentage={true} />
    );
    expect(getByTextOver('100%')).toBeTruthy();
  });

  it('applies custom styling correctly', () => {
    const customStyle = { marginTop: 20 };
    const { getByTestId } = render(
      <ProgressBar 
        progress={0.5} 
        style={customStyle}
        testID="styled-progress-bar"
      />
    );
    
    const progressBar = getByTestId('styled-progress-bar');
    expect(progressBar.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ flexDirection: 'column' }),
        customStyle
      ])
    );
  });

  it('applies custom colors correctly', () => {
    const { getByTestId } = render(
      <ProgressBar 
        progress={0.5}
        backgroundColor="#FF0000"
        fillColor="#00FF00"
        testID="colored-progress-bar"
      />
    );
    expect(getByTestId('colored-progress-bar')).toBeTruthy();
  });

  it('handles animated prop correctly', () => {
    const { getByTestId: getByTestIdAnimated } = render(
      <ProgressBar 
        progress={0.5}
        animated={true}
        testID="animated-progress-bar"
      />
    );
    expect(getByTestIdAnimated('animated-progress-bar')).toBeTruthy();

    const { getByTestId: getByTestIdNotAnimated } = render(
      <ProgressBar 
        progress={0.5}
        animated={false}
        testID="not-animated-progress-bar"
      />
    );
    expect(getByTestIdNotAnimated('not-animated-progress-bar')).toBeTruthy();
  });
});