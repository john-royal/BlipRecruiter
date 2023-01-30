/* eslint-disable max-len */

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {Configuration, OpenAIApi} from "openai";

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);


admin.initializeApp();
const db = admin.firestore();
const storage = admin.storage();

const streamToString = (stream: NodeJS.ReadableStream): Promise<string> => {
  const chunks: Uint8Array[] = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on("error", (err) => reject(err));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
};

const prompt = (description: string, resume: string) => `
Evaluate a resume with respect to a job description. Return a JSON object with two properties: a score from 0 to 10 where 1 is poor and 10 is excellent, and a description of why the resume received its score. Here is an example of such a JSON object:
{
    "score": 7,
    "reason": "The resume shows that the candidate has all of the required skills and experience and even more. They have advanced knowledge of HTML, CSS, and JavaScript, expertise in modern front-end frameworks such as React and TypeScript, experience with back-end technologies like Node.js and Express, familiarity with databases such as MySQL and MongoDB, and a passion for coding. They have also demonstrated their knowledge through projects and have relevant work experience."
}

Job Description:
${description}

Resume:
${resume}
`;

exports.evaluateApplication = functions.firestore.document("applications/{applicationID}").onCreate(async (snapshot) => {
  console.log("Application received!");
  console.log(snapshot.data());

  const application = snapshot.data();
  const jobDescription = (await db.doc(`jobs/${application.job}`).get()).get("description");
  const resume = await streamToString(storage.bucket().file(application.id).createReadStream());

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt(jobDescription, resume),
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  console.log(response.data.choices[0].text);
  const evaluation = JSON.parse(response.data.choices[0].text as string);

  return snapshot.ref.set(evaluation, {merge: true});
});

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
