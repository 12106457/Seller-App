import { useSpinner } from '@/context/spinnerContext';
import { faqData, faqResponse } from '@/models/common';
import { Entypo } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';

const HelpSection = () => {
  const [faqs, setFaqs] = useState<faqData[]>([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const {setLoading}=useSpinner();
  useEffect(() => {
    FetchFaqData();
  }, []);

  const FetchFaqData = () => {
        setLoading(true);
          fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/faq/get`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => {
              
              return response.json();
            })
            .then((data:faqResponse) => {
              if (data.status) {
                setFaqs(data?.data||[]);
             
              } else {
                setFaqs([]);
              }
              setLoading(false);
            })
            .catch((error) => {
              console.error("Error Fetching Data:", error.message);
              setFaqs([]);
              setLoading(false);
            });
            
        };

  const toggleAnswer = (index:any) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };
  const renderBoldText = (text: string) => {
    return text.split("\n").map((line, index) => {
      const trimmedLine = line.trim();
  
      // Identify different bullet levels
      const isMainBullet = trimmedLine.startsWith("•");
      const isSubBullet = trimmedLine.startsWith("-");
  
      // Extract bullet character
      const bulletChar = isMainBullet ? "•" : isSubBullet ? "-" : "";
  
      // Remove bullet from the text content
      const textWithoutBullet = bulletChar ? trimmedLine.substring(1).trim() : trimmedLine;
  
      // Format bold text within content
      const formattedText = textWithoutBullet.split(/\*\*(.*?)\*\*/).map((part, i) =>
        i % 2 === 0 ? (
          <Text key={i}>{part}</Text>
        ) : (
          <Text key={i} style={{ fontWeight: "bold" }}>{part}</Text>
        )
      );
  
      return (
        <View
          key={index}
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            paddingLeft: isMainBullet ? 10 : isSubBullet ? 30 : 0, // More indentation for sub-bullets
          }}
        >
          {bulletChar && (
            <Text style={{ fontSize: 16, marginRight: 8, fontWeight: isSubBullet ? "300" : "bold" }}>
              {bulletChar} {/* Show bullet point */}
            </Text>
          )}
          <Text style={{ flex: 1, fontSize: 16, color: "gray" }}>{formattedText}</Text>
        </View>
      );
    });
  };
  
  

  const renderItem = ({ item, index }:{item:faqData,index:any}) => (
    <View style={styles.faqItem}>
      <TouchableOpacity onPress={() => toggleAnswer(index)}>
        <View style={{flexDirection:"row", justifyContent:"space-between",alignItems:"flex-start"}}>
            <Text style={styles.title}>{item.question}</Text>
            {
                expandedIndex!==index ? 
                (<Entypo name="triangle-down" size={24} color="black" />):
                (<Entypo name="triangle-up" size={24} color="black" />)
            }
        </View>
      </TouchableOpacity>
      {expandedIndex === index && (
        <Text style={styles.answer}>{renderBoldText(item.answer)}</Text>
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
