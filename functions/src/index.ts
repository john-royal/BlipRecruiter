import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import OpenAIClient from './openai';

admin.initializeApp();
const db = admin.firestore();
const storage = admin.storage();
const openai = new OpenAIClient();

const getJobDescriptionByID = async (jobID: string): Promise<string> => {
	const job = await db.doc(`jobs/${jobID}`).get();
	return job.get('description') as string;
};

const getResumeForApplicationID = async (applicationID: string): Promise<string> => {
	const convertReadStreamToString = async (stream: NodeJS.ReadableStream): Promise<string> => {
		const chunks: Uint8Array[] = [];
		return new Promise((resolve, reject) => {
			stream.on('data', chunk => chunks.push(Buffer.from(chunk)));
			stream.on('error', err => {
				reject(err);
			});
			stream.on('end', () => {
				resolve(Buffer.concat(chunks).toString('utf8'));
			});
		});
	};

	const file = storage.bucket().file(applicationID);
	const fileReadStream = file.createReadStream();
	return convertReadStreamToString(fileReadStream);
};

exports.evaluateApplication = functions.firestore.document('applications/{applicationID}').onCreate(async snapshot => {
	const application = snapshot.data() as {id: string; name: string; email: string; job: string};

	console.log(`Application ${application.id} is processing (${JSON.stringify(application)})`);

	const [resume, jobDescription] = await Promise.all([
		getResumeForApplicationID(application.id),
		getJobDescriptionByID(application.job),
	]);
	const {score, reason} = await openai.scoreResumeForJob(resume, jobDescription);

	console.log(`Application ${application.id} has been processed with score ${score}`);

	return snapshot.ref.set({score, reason}, {merge: true});
});
