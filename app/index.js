import { useState } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  SafeAreaView,
  StyleSheet,
  Text,
} from 'react-native';
import { Stack } from 'expo-router';
import { ScreenHeaderBtn } from '../components';
import { COLORS, SIZES } from '../constants';
import { YoutubeTranscript } from 'youtube-transcript-axios';
import { OPENAI_API_KEY } from '@env';
import axios from 'axios';

function concatenateYoutubeTranscription(data) {
  return data.reduce((acc, curr) => acc + curr.text + ' ', '');
}

async function fetchTranscripts(url) {
  const transcriptionData = await YoutubeTranscript.fetchTranscript(url);
  return concatenateYoutubeTranscription(transcriptionData);
}

async function summarize(url) {
  const fetchedTranscripts = await fetchTranscripts(url);

  const response = await axios({
    method: 'post',
    url: `https://api.openai.com/v1/chat/completions`,
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        `Bearer ${OPENAI_API_KEY}`
    },
    data: {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content:
            'Summerize this youtube video with title: Summerizing' +
            fetchedTranscripts,
        },
      ],
    },
  });

  const res = response.data.choices[0].message.content;
  return res;
}

export default function Home() {
  const styles = StyleSheet.create({
    searchContainer: {
      flex: 1,
      marginTop: 20,
      paddingHorizontal: 15,
    },
    searchWrapper: {
      flex: 1,
      backgroundColor: '#f0f0f0',
      borderRadius: 30,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
    },
    searchInput: {
      flex: 1,
      marginLeft: 10,
      fontSize: 18,
    },
    transcriptBox: {
      padding: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      backgroundColor: '#f0f0f0',
      borderRadius: 10,
      marginVertical: 10,
    },
    transcriptText: {
      color: 'black',
      fontSize: 16,
      lineHeight: 24,
    },
    linkText: {
      fontSize: 18,
      color: COLORS.darkBlack, // Replace with your desired color
      fontWeight: 'bold',
      margin: 8, // Space under the text
      textAlign: 'center', // Add this line
    },
  });

  const [inputValue, setInputValue] = useState('');
  const [transcripts, setTranscripts] = useState('');
  const [title, setTitle] = useState('');

  const handleClick = async () => {
    if (!inputValue.trim()) {
      setTitle('Please enter a YouTube link before proceeding');
      return;
    }

    try {
      const fetchedTranscripts = await fetchTranscripts(inputValue);
      setTranscripts(fetchedTranscripts);
      setTitle('Extracted Text');
    } catch (error) {
      setTitle('Provide a valid youtube link');
    }
  };

  const handleSummarize = async () => {
    if (!inputValue.trim()) {
      setTitle('Please enter a YouTube link before proceeding');
      return;
    }

    try {
      const summarizedTranscripts = await summarize(inputValue);
      setTranscripts(summarizedTranscripts);
      setTitle('Summarized Text');
    } catch (error) {
      setTitle('Error during summarization');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: COLORS.lightWhite,
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <ScreenHeaderBtn name='Extract Text' handlePress={handleClick} />
          ),
          headerRight: () => (
            <ScreenHeaderBtn
              name='Generate summary'
              handlePress={handleSummarize}
            />
          ),
          headerTitle: '',
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1, padding: SIZES.padding }}>
          <View style={{ flex: 1 }}>
            <View style={styles.searchContainer}>
              <View style={styles.searchWrapper}>
                <TextInput
                  style={styles.searchInput}
                  placeholder='Paste your youtube link here'
                  onChangeText={(value) => setInputValue(value)}
                  placeholderTextColor='#999'
                />
              </View>
              <Text style={styles.linkText}>
                {title ? title : 'Press Any button'}
              </Text>
              <View style={styles.transcriptBox}>
                <Text style={styles.transcriptText}>{transcripts}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
