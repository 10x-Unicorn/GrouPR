import React, { useState } from 'react';
import { View, Text, Button, Modal, TouchableOpacity, StyleSheet } from 'react-native';

const ExerciseScreen = () => {
  const [squatModalVisible, setSquatModalVisible] = useState(false);
  const [benchModalVisible, setBenchModalVisible] = useState(false);
  const [deadliftModalVisible, setDeadliftModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>New Exercise Screen</Text>

      <TouchableOpacity onPress={() => setSquatModalVisible(true)}>
        <Text style={styles.exerciseButton}>Add Squat</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setBenchModalVisible(true)}>
        <Text style={styles.exerciseButton}>Add Bench</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setDeadliftModalVisible(true)}>
        <Text style={styles.exerciseButton}>Add Deadlift</Text>
      </TouchableOpacity>

      {/* Modals for Squat, Bench, and Deadlift */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={squatModalVisible}
      >
        <View style={styles.modal}>
          <Text style={styles.modalText}>Squat Modal Content</Text>
          <Button
            title="Close"
            onPress={() => setSquatModalVisible(false)}
          />
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={benchModalVisible}
      >
        <View style={styles.modal}>
          <Text style={styles.modalText}>Bench Modal Content</Text>
          <Button
            title="Close"
            onPress={() => setBenchModalVisible(false)}
          />
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={deadliftModalVisible}
      >
        <View style={styles.modal}>
          <Text style={styles.modalText}>Deadlift Modal Content</Text>
          <Button
            title="Close"
            onPress={() => setDeadliftModalVisible(false)}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  exerciseButton: {
    fontSize: 18,
    marginBottom: 10,
    color: 'blue',
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalText: {
    fontSize: 20,
    color: 'white',
    marginBottom: 20,
  },
});

export default ExerciseScreen;