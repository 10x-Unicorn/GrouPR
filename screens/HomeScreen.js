import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const HomeScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Welcome to GroupPr</Text>
        <Text style={styles.subtitle}>
          Achieve your fitness goals with your gym squad!
        </Text>
      </View>
      <TouchableOpacity style={styles.card} onPress={() => console.log('Chat with Your Squad')}>
        <Text style={styles.cardTitle}>Chat with Your Squad</Text>
        <Text style={styles.cardText}>Stay connected with your gym buddies via group chats.</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.card} onPress={() => console.log('Write and Track Workouts')}>
        <Text style={styles.cardTitle}>Write and Track Workouts</Text>
        <Text style={styles.cardText}>Keep a record of your workouts and monitor your progress over time.</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.card} onPress={() => console.log('Earn Trophies')}>
        <Text style={styles.cardTitle}>Earn Trophies</Text>
        <Text style={styles.cardText}>Achieve milestones and earn trophies for bragging rights among your squad.</Text>
      </TouchableOpacity>
      {/* Add more features here */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
  },
  headerContainer: {
    marginTop: 40,
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  cardText: {
    color: '#6b7280',
    fontSize: 15,
  },
});

export default HomeScreen;