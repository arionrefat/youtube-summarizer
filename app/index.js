import { useState } from "react";
import {
  View,
  ScrollView,
  TextInput,
  SafeAreaView,
  StyleSheet,
  Text,
} from "react-native";
import { Stack } from "expo-router";
import { ScreenHeaderBtn } from "../components";
import { COLORS, SIZES } from "../constants";
import { summarize } from "../components/utils";
import { fetchTranscripts } from "../components/utils";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [transcripts, setTranscripts] = useState("");
  const [title, setTitle] = useState("");

  const handleClick = async () => {
    if (!inputValue.trim()) {
      setTitle("Please enter a YouTube link before proceeding");
      return;
    }

    try {
      const fetchedTranscripts = await fetchTranscripts(inputValue);
      setTranscripts(fetchedTranscripts);
      setTitle("Extracted Text");
    } catch (error) {
      setTitle("Provide a valid youtube link");
    }
  };

  const handleSummarize = async () => {
    if (!inputValue.trim()) {
      setTitle("Please enter a YouTube link before proceeding");
      return;
    }

    try {
      const summarizedTranscripts = await summarize(inputValue);
      setTranscripts(summarizedTranscripts);
      setTitle("Summarized Text");
    } catch (error) {
      setTitle("Error during summarization");
    }
  };

  const styles = StyleSheet.create({
    searchContainer: {
      flex: 1,
      marginTop: 20,
      paddingHorizontal: 15,
    },
    searchWrapper: {
      flex: 1,
      backgroundColor: "#f0f0f0",
      borderRadius: 30,
      flexDirection: "row",
      alignItems: "center",
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
      borderColor: "#ccc",
      backgroundColor: "#f0f0f0",
      borderRadius: 10,
      marginVertical: 10,
    },
    transcriptText: {
      color: "black",
      fontSize: 16,
      lineHeight: 24,
    },
    linkText: {
      fontSize: 18,
      color: COLORS.darkBlack,
      fontWeight: "bold",
      margin: 8,
      textAlign: "center",
    },
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: COLORS.lightWhite,
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <ScreenHeaderBtn name="Extract Text" handlePress={handleClick} />
          ),
          headerRight: () => (
            <ScreenHeaderBtn
              name="Generate summary"
              handlePress={handleSummarize}
            />
          ),
          headerTitle: "",
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1, padding: SIZES.padding }}>
          <View style={{ flex: 1 }}>
            <View style={styles.searchContainer}>
              <View style={styles.searchWrapper}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Paste your youtube link here"
                  onChangeText={(value) => setInputValue(value)}
                  placeholderTextColor="#999"
                />
              </View>
              <Text style={styles.linkText}>
                {title ? title : "Press Any button"}
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
