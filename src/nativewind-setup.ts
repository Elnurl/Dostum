import { StyleSheet } from 'react-native';

const nativeWindSheet = StyleSheet as typeof StyleSheet & {
  setFlag?: (key: string, value: string) => void;
};

nativeWindSheet.setFlag?.('darkMode', 'class');
