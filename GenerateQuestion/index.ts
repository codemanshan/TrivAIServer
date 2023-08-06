import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import axios from 'axios';

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const response = await axios.post(
    'https://api.openai.com/v4/engines/davinci-codex/completions',
    {
      prompt: 'Generate a trivia question with multiple choice answers.',
      max_tokens: 60,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    }
  );

  const result = response.data.choices[0].text.trim();

  const questionAndAnswers = result.split('\n');
  const question = questionAndAnswers[0];
  const answers = questionAndAnswers.slice(1);
  const correctAnswer = answers[0];

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: {
      question,
      answers,
      correctAnswer,
    },
  };
};

export default httpTrigger;
