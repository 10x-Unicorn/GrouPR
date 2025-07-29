import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
// import { databases } from './appwrite'; // Uncomment and adjust path to your Appwrite config

const HomeScreen = () => {
  const [stats, setStats] = useState({
    workoutsThisWeek: 0,
    totalWorkouts: 0,
    currentStreak: 0,
    squadMembers: 0,
    activeChallenges: 0,
    loading: true
  });

  // Mock data for demonstration - replace with actual Appwrite calls
  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true }));
      
      // Replace these with actual Appwrite database calls
      // Example Appwrite calls:
      /*
      const workoutsResponse = await databases.listDocuments(
        'your-database-id',
        'workouts-collection-id',
        [
          Query.equal('userId', 'current-user-id'),
          Query.greaterThanEqual('date', getWeekStart())
        ]
      );
      
      const squadResponse = await databases.listDocuments(
        'your-database-id',
        'squad-members-collection-id',
        [Query.equal('squadId', 'user-squad-id')]
      );
      */

      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - replace with actual database results
      setStats({
        workoutsThisWeek: 4,
        totalWorkouts: 127,
        currentStreak: 7,
        squadMembers: 8,
        activeChallenges: 3,
        loading: false
      });
      
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const handleNavigation = (section) => {
    console.log(`Navigate to ${section}`);
    // Add your navigation logic here
  };

  const StatCard = ({ label, value, icon, color = "text-gray-900" }) => (
    <View className="items-center flex-1">
      <Text className={`text-2xl font-bold ${color}`}>
        {stats.loading ? '•••' : value}
      </Text>
      <Text className="text-xs text-gray-600 text-center mt-1">
        {icon} {label}
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Enhanced Stats Header */}
      <View className="bg-white px-4 pt-4 pb-2 shadow-sm">
        <View className="items-center mb-4">
          <Text className="text-2xl font-bold text-gray-900">Welcome to GroupPR</Text>
          <Text className="text-base text-gray-600 text-center mt-1">
            Achieve your fitness goals with your squad!
          </Text>
        </View>

        {/* Stats Row */}
        <View className="bg-gray-50 rounded-xl p-4 mb-4">
          <View className="flex-row justify-between items-center">
            <StatCard 
              label="This Week" 
              value={stats.workoutsThisWeek} 
              icon="💪"
              color="text-blue-600"
            />
            <View className="w-px h-8 bg-gray-300" />
            <StatCard 
              label="Total PRs" 
              value={stats.totalWorkouts} 
              icon="🏆"
              color="text-green-600"
            />
            <View className="w-px h-8 bg-gray-300" />
            <StatCard 
              label="Streak" 
              value={`${stats.currentStreak}d`} 
              icon="🔥"
              color="text-orange-600"
            />
            <View className="w-px h-8 bg-gray-300" />
            <StatCard 
              label="Squad" 
              value={stats.squadMembers} 
              icon="👥"
              color="text-purple-600"
            />
          </View>
        </View>
        
        {/* Navigation Buttons */}
        <View className="flex-row justify-between mb-4">
          <TouchableOpacity 
            className="bg-blue-500 rounded-lg px-4 py-3 flex-1 mr-2"
            onPress={() => handleNavigation('Groups')}
          >
            <Text className="text-white text-center font-semibold">👥 Groups</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="bg-green-500 rounded-lg px-4 py-3 flex-1 mx-1"
            onPress={() => handleNavigation('Challenges')}
          >
            <Text className="text-white text-center font-semibold">🏆 Challenges</Text>
            {stats.activeChallenges > 0 && (
              <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
                <Text className="text-white text-xs font-bold">{stats.activeChallenges}</Text>
              </View>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="bg-purple-500 rounded-lg px-4 py-3 flex-1 mx-1"
            onPress={() => handleNavigation('Workout')}
          >
            <Text className="text-white text-center font-semibold">💪 Workout</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="bg-orange-500 rounded-lg px-4 py-3 flex-1 ml-2"
            onPress={() => handleNavigation('Food Log')}
          >
            <Text className="text-white text-center font-semibold">🍎 Food</Text>
          </TouchableOpacity>
        </View>

        {/* Pull to refresh hint */}
        <TouchableOpacity 
          onPress={fetchUserStats}
          className="items-center py-2"
        >
          <Text className="text-xs text-gray-500">
            {stats.loading ? 'Loading...' : 'Tap to refresh stats'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Feed */}
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <View className="py-4">
          {/* Feed Title */}
          <Text className="text-xl font-bold text-gray-900 mb-4">Your Feed</Text>
          
          {/* Feed Cards */}
          <TouchableOpacity 
            className="bg-white rounded-xl p-5 mb-4 shadow-sm"
            onPress={() => console.log('Chat with Your Squad')}
          >
            <Text className="text-lg font-semibold text-gray-900 mb-2">💬 Chat with Your Squad</Text>
            <Text className="text-gray-600 text-base">Stay connected with your gym buddies via group chats.</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="bg-white rounded-xl p-5 mb-4 shadow-sm"
            onPress={() => console.log('Write and Track Workouts')}
          >
            <Text className="text-lg font-semibold text-gray-900 mb-2">📝 Write and Track Workouts</Text>
            <Text className="text-gray-600 text-base">Keep a record of your workouts and monitor your progress over time.</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="bg-white rounded-xl p-5 mb-4 shadow-sm"
            onPress={() => console.log('Earn Trophies')}
          >
            <Text className="text-lg font-semibold text-gray-900 mb-2">🏆 Earn Trophies</Text>
            <Text className="text-gray-600 text-base">Achieve milestones and earn trophies for bragging rights among your squad.</Text>
          </TouchableOpacity>

          {/* Recent Activity Card */}
          <TouchableOpacity 
            className="bg-white rounded-xl p-5 mb-4 shadow-sm"
            onPress={() => console.log('Recent Activity')}
          >
            <Text className="text-lg font-semibold text-gray-900 mb-2">📈 Recent Activity</Text>
            <Text className="text-gray-600 text-base">See what your squad has been up to lately and celebrate their achievements.</Text>
          </TouchableOpacity>

          {/* Workout Suggestions Card */}
          <TouchableOpacity 
            className="bg-white rounded-xl p-5 mb-4 shadow-sm"
            onPress={() => console.log('Workout Suggestions')}
          >
            <Text className="text-lg font-semibold text-gray-900 mb-2">💡 Workout Suggestions</Text>
            <Text className="text-gray-600 text-base">Discover new workouts tailored to your fitness level and goals.</Text>
          </TouchableOpacity>

          {/* Nutrition Tips Card */}
          <TouchableOpacity 
            className="bg-white rounded-xl p-5 mb-20 shadow-sm"
            onPress={() => console.log('Nutrition Tips')}
          >
            <Text className="text-lg font-semibold text-gray-900 mb-2">🥗 Nutrition Tips</Text>
            <Text className="text-gray-600 text-base">Get daily nutrition advice to fuel your workouts and recovery.</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;