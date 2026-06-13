import axios from "axios";

export const askAi = async (messages) => {

  try {

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },

        timeout: 30000,
      }
    );

    return response.data.choices[0].message.content;

  } catch (error) {

    console.log(
      "OPENROUTER ERROR:",
      error.response?.data || error.message
    );

    throw new Error("AI analysis failed");
  }
};