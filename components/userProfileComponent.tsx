import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import React, { useState } from 'react';
import { AntDesign, Octicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

interface FormDataType {
  lastname: string;
  firstname: string;
  email:string;
  phone: string;
  password: string;
}

interface PropType {
  onSave: (data: FormDataType) => void;
}

const UserProfileComponent = ({ onSave }: PropType) => {
  const [formData, setFormData] = useState<FormDataType>({
    firstname: '',
    lastname: '',
    email:'',
    phone: '',
    password: '',
  });
  const [formDataError,SetFormDataError]=useState({
    firstname: false,
    lastname: false,
    email:false,
    phone: false,
    password: false,
  })

  const [secureText, setSecureText] = useState(true);
  const toggleSecureTextEntry = () => setSecureText(!secureText);

  const handleChange = ({ text, field }: { text: string; field: string }) => {
    setFormData((prev) => ({ ...prev, [field]: text }));
  };

  const handleSubmit = () => {
    const errors = {
      firstname: formData.firstname.trim() === "",
      lastname: formData.lastname.trim() === "",
      email: formData.email.trim() === "",
      phone: formData.phone.trim() === "" || !/^\d{10}$/.test(formData.phone),
      password: formData.password.trim() === "" || formData.password.length < 6,
    };
  
    SetFormDataError(errors);
  
    // If any error exists, return early
    if (Object.values(errors).some((error) => error)) {
      return;
    }
  
    // If all fields are valid, proceed with form submission
    onSave(formData);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.inputContainer}>
            <View style={styles.logoContainer}>
              <Image source={require('../assets/images/splashlogo.png')} style={styles.logo} />
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>India's Fastest App</Text>
              <Text style={styles.subtitle}>Create a new account</Text>
            </View>
            <TextInput
              style={[
                styles.input,
                formDataError.firstname && { borderColor: "red", borderWidth: 1 }
              ]}
              placeholder="Enter Firstname"
              value={formData.firstname}
              onChangeText={(text) => handleChange({ text, field: 'firstname' })}
            />
            <TextInput
              style={[
                styles.input,
                formDataError.lastname && { borderColor: "red", borderWidth: 1 }
              ]}
              placeholder="Enter Lastname"
              value={formData.lastname}
              onChangeText={(text) => handleChange({ text, field: 'lastname' })}
            />

            <TextInput
              style={[
                styles.input,
                formDataError.email && { borderColor: "red", borderWidth: 1 }
              ]}
              placeholder="Enter Email"
              value={formData.email}
              onChangeText={(text) => handleChange({ text, field: 'email' })}
            />
            <TextInput
              style={[
                styles.input,
                formDataError.phone && { borderColor: "red", borderWidth: 1 }
              ]}
              keyboardType="phone-pad"
              placeholder="Enter Phone"
              value={formData.phone}
              onChangeText={(text) => handleChange({ text, field: 'phone' })}
            />
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.input,
                  formDataError.password && { borderColor: "red", borderWidth: 1 }
                ]}
                placeholder="Enter Password"
                value={formData.password}
                secureTextEntry={secureText}
                onChangeText={(text) => handleChange({ text, field: 'password' })}
              />
              <TouchableOpacity onPress={toggleSecureTextEntry} style={styles.iconContainer}>
                {!secureText ? (
                  <AntDesign name="eyeo" size={24} color="gray" />
                ) : (
                  <Octicons name="eye-closed" size={24} color="gray" />
                )}
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.signInBtn} onPress={handleSubmit}>
              <Text style={styles.signInTxt}>Create</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default UserProfileComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 20,
  },
  logoContainer: {
    width: '100%',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: Colors.primaryColor,
    tintColor: Colors.white,
  },
  titleContainer: {
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  inputContainer: {
    width: '90%',
    marginTop: 15,
    gap: 15,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    elevation: 5,
    padding: 10,
    alignSelf: 'center',
    borderRadius: 10,
  },
  input: {
    width: '100%',
    borderRadius: 15,
    backgroundColor: Colors.bgColor,
    color: Colors.black,
    padding: 15,
    marginTop: 5,
    fontSize: 18,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  signInBtn: {
    width: '100%',
    padding: 15,
    backgroundColor: Colors.primaryColor,
    borderRadius: 20,
    marginTop: 10,
  },
  signInTxt: {
    color: Colors.white,
    fontSize: 20,
    textAlign: 'center',
  },
});