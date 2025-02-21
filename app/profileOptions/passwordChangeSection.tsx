import Colors from '@/constants/Colors';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import ToastManager, { Toast } from 'toastify-react-native';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = () => {
   if(!currentPassword||!newPassword||!confirmPassword){
    Toast.warn("Please field all the data")
   }
  };

  return (
    <>
      <ToastManager 
      showCloseIcon={false}
      showProgressBar={false}
      />
      <Stack.Screen
        options={{
          headerTitle: 'Change Password',
          headerShown: true,
         
        }}
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior="padding"
          keyboardVerticalOffset={100}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="interactive"
          >
            <View style={styles.FormContainer}>
              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Current Password</Text>
                <TextInput
                  style={styles.inputField}
                  value={currentPassword}
                  placeholder="Enter current password"
                  onChangeText={(text) => setCurrentPassword(text)}
                  secureTextEntry
                />
              </View>
              <View style={styles.formSection}>
                <Text style={styles.formLabel}>New Password</Text>
                <TextInput
                  style={styles.inputField}
                  value={newPassword}
                  placeholder="Enter new password"
                  onChangeText={(text) => setNewPassword(text)}
                  secureTextEntry
                />
              </View>
              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Confirm New Password</Text>
                <TextInput
                  style={styles.inputField}
                  value={confirmPassword}
                  placeholder="Confirm new password"
                  onChangeText={(text) => setConfirmPassword(text)}
                  secureTextEntry
                />
              </View>
              <View style={styles.submitBtn}>
              <Button
                title="Change Password"
                color={Colors.primaryColor}
                onPress={handleChangePassword}
              />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  headerLeft: {
    marginLeft: 5,
    padding: 5,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  FormContainer: {
    width: '100%',
    padding: 20,
    marginBottom: 0,
    gap: 15,
  },
  formSection: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  formLabel: {
    fontSize: 20,
    fontWeight: '500',
  },
  inputField: {
    width: '100%',
    borderRadius: 15,
    backgroundColor: '#ebeded',
    color: Colors.black,
    padding: 10,
    marginTop: 5,
    fontSize: 18,
  },
  submitBtn:{
    marginTop:40,
  }
});
