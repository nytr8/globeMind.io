import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, SystemMessage } from "langchain";

const TagModel = new ChatMistralAI({
  apiKey: process.env.MISTRAL_API_KEY,
  model: "mistral-small-latest",
});

export async function generateTags(description) {
  try {
    const response = await TagModel.invoke([
      new SystemMessage(
        "You are a tag generator. Generate exactly 4 short, relevant tags. Return ONLY a JSON array.",
      ),
      new HumanMessage(
        `Text: ${description}

Rules:
- Exactly 4 tags
- Lowercase
- No duplicates
- do not add numbers attach to text
- Single words or short phrases
- Output format: ["tag1","tag2","tag3","tag4"]`,
      ),
    ]);

    // Clean + parse response
    let content = response.content;

    // Remove unwanted text if model adds extra
    const jsonMatch = content.match(/\[.*\]/s);
    if (jsonMatch) {
      content = jsonMatch[0];
    }

    const tags = JSON.parse(content);

    return tags;
  } catch (error) {
    console.error("Tag generation error:", error);
    return [];
  }
}
