import React, { useState }from 'react';
import { View, Text, StyleSheet, SafeAreaView,  Button, Modal, TouchableOpacity } from 'react-native';

const WorkoutScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Workout Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default WorkoutScreen;