import axios from 'axios';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export async function fetchChatGPTReply(messages: { role: string; content: string }[]) {
  const res = await axios.post(OPENAI_API_URL, {
    model: 'gpt-3.5-turbo',
    messages,
  }, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    },
  });
  return res.data.choices?.[0]?.message;
}
