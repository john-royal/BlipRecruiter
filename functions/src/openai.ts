import {Configuration, OpenAIApi} from 'openai';

export default class OpenAIClient {
	private readonly openai: OpenAIApi;

	constructor(apiKey: string = process.env.OPENAI_API_KEY!) {
		const configuration = new Configuration({
			apiKey,
		});
		this.openai = new OpenAIApi(configuration);

		console.log(`OpenAI client initialized with key: ${apiKey}`);
	}

	async scoreResumeForJob(resume: string, jobDescription: string) {
		const prompt = `
        Evaluate a resume with respect to a job description. Return a JSON object with two properties: a score from 0 to 10 where 0 is poor and 10 is excellent, and a description of why the resume received its score.
        
        Here’s an example of an evaluation for a resume with no relevant experience or qualifications:
        {
            "score": 0,
            "reason": "The resume does not contain any relevant experience or qualifications."
        }
    
        Here’s an evaluation of a resume that contains limited experience and some of the required qualifications:
        {
            "score": 5,
            "reason": "The candidate has some of the qualifications required for the job, including skills in HTML, CSS, JavaScript, and Git, as well as a Computer Science degree. However, there is little real-world work experience and is missing some skills, such as TypeScript, Node.js, MongoDB, and GraphQL."
        }
    
        Here is an example of an excellent evaluation:
        {
            "score": 10,
            "reason": "The candidate is highly qualified for the position, with a degree in computer science from a prestigious university and significant experience in HTML, CSS, JavaScript, TypeScript, React, Node.js, MongoDB, and GraphQL. The candidate has 5+ years of experience in full-stack web development at Google and elsewhere, and has also demonstrated their skills and passion through personal projects and volunteer work."
        }
        
        Job Description:
        ${jobDescription}
        
        Resume:
        ${resume}
    
        Evaluation:
        `;
		const response = await this.openai.createCompletion({
			model: 'text-davinci-003',
			prompt,
			temperature: 0.7,
			max_tokens: 256,
			top_p: 1,
			frequency_penalty: 0,
			presence_penalty: 0,
		});
		return JSON.parse(response.data.choices[0].text!) as {score: number; reason: string};
	}
}
