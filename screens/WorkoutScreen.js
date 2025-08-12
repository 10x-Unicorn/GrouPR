import React, { useState, useRef, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Animated, Dimensions, PanResponder } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import WorkoutPlansTab from '../components/WorkoutPlansTab';
import IndividualWorkoutsTab from '../components/IndividualWorkoutsTab';

const TAB_TYPES = {
  PLANS: 'plans',
  INDIVIDUAL: 'individual'
};

const TAB_CONFIG = [
  { id: TAB_TYPES.PLANS, label: 'Workout Plans' },
  { id: TAB_TYPES.INDIVIDUAL, label: 'Individual Workouts' }
];

// Custom Top Tab Bar Component with Animation
const CustomTopTabBar = ({ tabs, activeTab, onTabChange, theme }) => {
  const indicatorPosition = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get('window').width;
  const containerWidth = screenWidth - 48; // Account for mx-6 (24px each side)
  const tabWidth = containerWidth / tabs.length;
  
  const indicatorWidth = tabWidth; // Make indicator full tab width
  
  useEffect(() => {
    const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
    const targetPosition = activeIndex * tabWidth;
    
    Animated.spring(indicatorPosition, {
      toValue: targetPosition,
      useNativeDriver: false,
      tension: 150,
      friction: 8,
    }).start();
  }, [activeTab, tabWidth]);

  return (
    <View className="mx-6 mb-6">
      {/* Tab Buttons */}
      <View className="flex-row relative">
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            className="flex-1 py-3 px-4"
            onPress={() => onTabChange(tab.id)}
          >
            <Text
              className="text-center font-semibold text-sm"
              style={{
                color: activeTab === tab.id ? theme.colors.text : theme.colors.textSecondary,
              }}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Animated Tab Indicator */}
      <Animated.View
        className="h-1 rounded-full"
        style={{
          backgroundColor: theme.isDark ? '#38bdf8' : '#3b82f6',
          width: indicatorWidth,
          marginLeft: indicatorPosition,
        }}
      />
    </View>
  );
};

const WorkoutScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState(TAB_TYPES.PLANS);
  const [isSwipeActive, setIsSwipeActive] = useState(false);
  const theme = useTheme();

  const handleTabChange = (tabId) => {
    console.log('Switching to tab:', tabId);
    setActiveTab(tabId);
  };

  // Swipe gesture handling - recreate PanResponder when activeTab changes
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      // Only respond to horizontal swipes
      const isHorizontalSwipe = Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      const hasMinimumMovement = Math.abs(gestureState.dx) > 10;
      return isHorizontalSwipe && hasMinimumMovement;
    },
    onPanResponderGrant: (evt, gestureState) => {
      // User started touching/swiping
      setIsSwipeActive(true);
    },
    onPanResponderMove: (evt, gestureState) => {
      // Optional: Add visual feedback during swipe
    },
    onPanResponderRelease: (evt, gestureState) => {
      setIsSwipeActive(false);
      const { dx } = gestureState;
      const swipeThreshold = 30;
      
      if (Math.abs(dx) > swipeThreshold) {
        if (dx > 0) {
          // Swipe right - go to Plans (left tab)
          if (activeTab === TAB_TYPES.INDIVIDUAL) {
            handleTabChange(TAB_TYPES.PLANS);
          } else {
            console.log('Already on Plans tab, cannot swipe right further');
          }
        } else {
          // Swipe left - go to Individual (right tab)
          console.log('Swiping left to Individual from:', activeTab);
          if (activeTab === TAB_TYPES.PLANS) {
            handleTabChange(TAB_TYPES.INDIVIDUAL);
          } else {
            console.log('Already on Individual tab, cannot swipe left further');
          }
        }
      } else {
        console.log('Swipe distance too small:', Math.abs(dx), 'threshold:', swipeThreshold);
      }
    },
    onPanResponderTerminate: (evt, gestureState) => {
      // Gesture was interrupted
      setIsSwipeActive(false);
    },
  });

  const renderActiveTab = () => {
    const commonProps = { navigation };
    switch (activeTab) {
      case TAB_TYPES.PLANS:
        return <WorkoutPlansTab key="plans-tab" {...commonProps} />;
      case TAB_TYPES.INDIVIDUAL:
        return <IndividualWorkoutsTab key="individual-tab" {...commonProps} />;
      default:
        return <WorkoutPlansTab key="default-tab" {...commonProps} />;
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: theme.colors.background }}>
      <View className="flex-1">
        {/* Custom Top Tab Bar */}
        <CustomTopTabBar
          tabs={TAB_CONFIG}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          theme={theme}
        />

        {/* Tab Content with Swipe Support */}
        <View className="flex-1" {...panResponder.panHandlers}>
          {renderActiveTab()}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WorkoutScreen;