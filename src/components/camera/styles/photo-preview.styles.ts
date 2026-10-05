import { StyleSheet } from 'react-native';

/**
 * NO factory function here, unlike the other style files - every value
 * is already a percentage (relative to its correctly-sized parent) or a
 * structural constant (zIndex). Adding a `unit`-based factory here would
 * be ceremony with zero effect - this file was never part of the bug.
 */
export const styles = StyleSheet.create({
  result: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#171a15',
    zIndex: 10,
  },
  resultNoPointerEvents: {
    pointerEvents: 'none',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
});
