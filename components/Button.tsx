import { StyleSheet, View, Pressable, Text, LinearGradient } from 'react-native';

type Props = {
  label: string;
  onPress?: () => void;
};

export default function Button({ label,onPress }: Props) {
  return (
    <View style={styles.buttonContainer}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: pressed ? '#0077b6' : '#00c9ff' },
        ]}
        onPress={onPress}
      >
        <Text style={styles.buttonLabel}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 320,
    height: 60,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    borderRadius: 14,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00c9ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  buttonLabel: {
    color: '#0f2027',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
