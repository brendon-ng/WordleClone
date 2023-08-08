import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

const calcViewSize = (parentLayout, maxHeightPct, maxWidthPct) => {
  const size = Math.min(
    parentLayout.height,
    parentLayout.width,
    maxHeightPct ? parentLayout.height * (maxHeightPct / 100) : Infinity,
    maxWidthPct ? parentLayout.width * (maxWidthPct / 100) : Infinity
  );
  return size;
};

function SquareView({
  parentLayout,
  maxHeightPct,
  maxWidthPct,
  children,
  style,
}) {
  const [viewSize, setViewSize] = useState(
    calcViewSize(parentLayout, maxHeightPct, maxWidthPct)
  );

  useEffect(() => {
    setViewSize(calcViewSize(parentLayout, maxHeightPct, maxWidthPct));
  }, [parentLayout, maxHeightPct, maxWidthPct]);

  return (
    <View
      style={[
        style,
        styles.container,
        {
          height: viewSize,
          width: viewSize,
        },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});

export default SquareView;
