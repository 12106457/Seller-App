import { Entypo } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';

const HelpSection = () => {
  const [faqs, setFaqs] = useState<any>([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    const dummyFaqs = [
        {
          title: "What is React Native?",
          answer: "React Native is an open-source mobile application framework created by Facebook. It is used to develop applications for Android, iOS, and UWP by enabling developers to use React along with native platform capabilities."
        },
        {
          title: "How do I install React Native?",
          answer: "To install React Native, you need to have Node.js installed. Then, you can use the following command to install the React Native CLI:\n\n`npm install -g react-native-cli`"
        },
        {
          title: "What is a component in React Native?",
          answer: "A component in React Native is a reusable piece of UI. It can be a function or a class, and it returns a piece of UI code that can be reused throughout your application."
        },
        {
          title: "How do I style components in React Native?",
          answer: "In React Native, you can style components using the StyleSheet API. You create a StyleSheet object and use it to style your components.\n\n```javascript\nconst styles = StyleSheet.create({\n  container: {\n    flex: 1,\n    justifyContent: 'center',\n    alignItems: 'center',\n  },\n  text: {\n    fontSize: 16,\n    color: '#333',\n  },\n});\n```"
        },
        {
          title: "What are props in React Native?",
          answer: "Props (short for properties) are a way to pass data from parent to child components in React Native. They are used to configure components and can be accessed using `this.props` in class components or directly in function components."
        },
      ];
      setFaqs(dummyFaqs);
  }, []);

  const toggleAnswer = (index:any) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const renderItem = ({ item, index }:{item:any,index:any}) => (
    <View style={styles.faqItem}>
      <TouchableOpacity onPress={() => toggleAnswer(index)}>
        <View style={{flexDirection:"row", justifyContent:"space-between",alignItems:"flex-start"}}>
            <Text style={styles.title}>{item.title}</Text>
            {
                expandedIndex!==index ? 
                (<Entypo name="triangle-down" size={24} color="black" />):
                (<Entypo name="triangle-up" size={24} color="black" />)
            }
        </View>
      </TouchableOpacity>
      {expandedIndex === index && (
        <Text style={styles.answer}>{item.answer}</Text>
      )}
    </View>
  );

  return (
   <>
   <Stack.Screen
   options={{
    headerTitle:"FAQ's Section",
    headerShown:true
   }}
   />
    <View style={styles.container}>
      
      <FlatList
        data={faqs}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
   </>
  );
};

export default HelpSection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  faqItem: {
    marginBottom: 16,
    borderWidth:1,
    padding:8,
    borderRadius:5,
    borderColor:"lightgray"
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
   
  },
  answer: {
    fontSize: 16,
    marginTop: 4,
    color:"gray"
  },
});
