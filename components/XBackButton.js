import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the MaterialIcons icon


const XBackButton = () => {
    const navigation = useNavigation();

    return(
    <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="close" size={30} style={{ margin: 10 }} />
    </TouchableOpacity>
    );
};

export default XBackButton;

