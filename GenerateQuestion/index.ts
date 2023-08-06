import * as OpenAI from 'openai';
import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const openai = new OpenAI.Api({ apiKey: process.env.OPENAI_API_KEY });

    // Generate trivia question
    const promptForQuestion = 'Generate a trivia question and its answer:';
    const gptResponseForQuestion = await openai.complete({
        engine: 'davinci',
        prompt: promptForQuestion,
        max_tokens: 60,
    });

    const questionAndAnswer = gptResponseForQuestion.data.choices[0].text.trim().split('\n');
    const question = questionAndAnswer[0];
    const correctAnswer = questionAndAnswer[1];

    // Generate multiple choice options
    const promptForChoices = `Generate three wrong answers for the trivia question: "${question}"`;
    const gptResponseForChoices = await openai.complete({
        engine: 'davinci',
        prompt: promptForChoices,
        max_tokens: 60,
    });

    let choices = gptResponseForChoices.data.choices[0].text.trim().split('\n');
    
    // Insert correct answer at random index
    const correctIndex = Math.floor(Math.random() * 4);
    choices.splice(correctIndex, 0, correctAnswer);

    context.res = {
        body: {
            question: question,
            choices: choices,
            correctIndex: correctIndex
        }
    };
};

export default httpTrigger;
