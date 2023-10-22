import React from 'react';
import { Platform, ActionSheetIOS, TouchableOpacity} from 'react-native';
import { ActionSheet } from '@expo/react-native-action-sheet';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const WorkoutActionSheet = () => {
    const navigation = useNavigation();
    const actionSheetOptions = {
      options: ['Add New Workout', 'Cancel'],
    };
    const showActionSheet = () => {
        if (Platform.OS === 'ios') {
            ActionSheetIOS.showActionSheetWithOptions(actionSheetOptions, (selectedIndex) => {
            // iOS-specific logic here
            switch (selectedIndex) {
            case 0:
                console.log('Adding a new workout on iOS');
                navigation.navigate('NewWorkout');
                break;
            case 1:
                // Canceled
                break;
            }
        });
        } else {
            ActionSheet.showActionSheetWithOptions(actionSheetOptions, (selectedIndex) => {
            // Android-specific logic here
            switch (selectedIndex) {
            case 0:
                console.log('Adding a new workout on Android');
                break;
            case 1:
                // Canceled
                break;
            }
        });
        }
    }
    return (
        <TouchableOpacity style={{ marginRight: 16 }}
        onPress={showActionSheet}
        >
        <MaterialCommunityIcons name="plus-circle" size={24} color={"black"} />
        </TouchableOpacity>
    )
};

export default WorkoutActionSheet;