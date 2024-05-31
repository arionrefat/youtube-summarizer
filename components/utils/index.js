import { YoutubeTranscript } from 'youtube-transcript-axios';

export async function summarize(url) {
  const fetchedTranscripts = await fetchTranscripts(url);

  const response = await axios({
    method: "post",
    url: `https://api.openai.com/v1/chat/completions`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    data: {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content:
            "Summerize this youtube video with title: Summerizing" +
            fetchedTranscripts,
        },
      ],
    },
  });
}

export function concatenateYoutubeTranscription(data) {
  return data.reduce((acc, curr) => acc + curr.text + ' ', '');
}

export async function fetchTranscripts(url) {
  const transcriptionData = await YoutubeTranscript.fetchTranscript(url);
  return concatenateYoutubeTranscription(transcriptionData);
}