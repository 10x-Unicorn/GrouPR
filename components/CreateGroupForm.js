import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CreateGroupForm = ({ onGroupCreated, onCancel, createTeam }) => {
    const [groupName, setGroupName] = useState('');
    const [inviteEmails, setInviteEmails] = useState(['']);
    const [creating, setCreating] = useState(false);

    const addEmailField = () => {
        setInviteEmails([...inviteEmails, '']);
    };

    const removeEmailField = (index) => {
        if (inviteEmails.length > 1) {
            setInviteEmails(inviteEmails.filter((_, i) => i !== index));
        }
    };

    const updateEmail = (index, email) => {
        const newEmails = [...inviteEmails];
        newEmails[index] = email;
        setInviteEmails(newEmails);
    };

    const handleCreateGroup = async () => {
        if (!groupName.trim()) return;

        setCreating(true);
        
        try {
            const validEmails = inviteEmails.filter(email => email.trim() !== '');
            const team = await createTeam(groupName, validEmails);
            
            if (team) {
                onGroupCreated(team);
            }
        } catch (error) {
            console.error('Error in form:', error);
        } finally {
            setCreating(false);
        }
    };

    return (
        <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
            {/* Group Name Section */}
            <View className="bg-white dark:bg-slate-800 rounded-xl p-4 mb-6 border border-slate-200 dark:border-slate-700">
                <Text className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                    Group Details
                </Text>
                
                <Text className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Group Name *
                </Text>
                <TextInput
                    className="border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 text-base bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    placeholder="Enter group name..."
                    placeholderTextColor="#64748b"
                    value={groupName}
                    onChangeText={setGroupName}
                    maxLength={100}
                    editable={!creating}
                />
            </View>

            {/* Invite Members Section */}
            <View className="bg-white dark:bg-slate-800 rounded-xl p-4 mb-6 border border-slate-200 dark:border-slate-700">
                <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-lg font-semibold text-slate-900 dark:text-white">
                        Invite Members
                    </Text>
                    <TouchableOpacity
                        onPress={addEmailField}
                        className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg"
                        disabled={creating}
                    >
                        <MaterialCommunityIcons name="plus" size={20} color="#3b82f6" />
                    </TouchableOpacity>
                </View>

                <Text className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    Add email addresses to invite friends to your group (optional)
                </Text>

                {inviteEmails.map((email, index) => (
                    <View key={index} className="flex-row items-center mb-3">
                        <TextInput
                            className="flex-1 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 text-base bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                            placeholder="friend@example.com"
                            placeholderTextColor="#64748b"
                            value={email}
                            onChangeText={(text) => updateEmail(index, text)}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            editable={!creating}
                        />
                        {inviteEmails.length > 1 && (
                            <TouchableOpacity
                                onPress={() => removeEmailField(index)}
                                className="ml-3 p-2"
                                disabled={creating}
                            >
                                <MaterialCommunityIcons 
                                    name="close" 
                                    size={20} 
                                    color="#ef4444" 
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                ))}
            </View>

            {/* Info Box */}
            <View className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
                <View className="flex-row items-start">
                    <MaterialCommunityIcons 
                        name="information" 
                        size={20} 
                        color="#3b82f6" 
                        style={{ marginTop: 2, marginRight: 8 }} 
                    />
                    <Text className="flex-1 text-sm text-blue-800 dark:text-blue-200">
                        Friends will receive email invitations and can join when they create accounts. 
                        You can always invite more people later!
                    </Text>
                </View>
            </View>

            {/* Buttons */}
            <View className="flex-row space-x-3">
                <TouchableOpacity
                    className="flex-1 py-4 rounded-xl flex-row items-center justify-center border border-slate-300 dark:border-slate-600"
                    onPress={onCancel}
                    disabled={creating}
                >
                    <Text className="text-slate-700 dark:text-slate-300 font-semibold text-lg">
                        Cancel
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className={`flex-1 py-4 rounded-xl flex-row items-center justify-center ${
                        creating || !groupName.trim()
                            ? 'bg-slate-300 dark:bg-slate-600'
                            : 'bg-blue-500 active:bg-blue-600'
                    }`}
                    onPress={handleCreateGroup}
                    disabled={creating || !groupName.trim()}
                >
                    {creating ? (
                        <>
                            <MaterialCommunityIcons name="loading" size={20} color="white" />
                            <Text className="text-white font-semibold text-lg ml-2">
                                Creating...
                            </Text>
                        </>
                    ) : (
                        <>
                            <MaterialCommunityIcons name="check" size={20} color="white" />
                            <Text className="text-white font-semibold text-lg ml-2">
                                Create
                            </Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default CreateGroupForm;