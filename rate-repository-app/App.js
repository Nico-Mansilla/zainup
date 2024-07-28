import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}> 
      <TouchableNativeFeedback onPress={() => Alert.alert('Comodoro')}>
        <View>
          <Text>Hola</Text>
          <StatusBar style="auto" />
        </View>
      </TouchableNativeFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
