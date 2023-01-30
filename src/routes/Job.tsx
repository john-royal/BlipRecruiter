import { doc, getDoc } from 'firebase/firestore';
import { Container } from 'react-bootstrap';
import { LoaderFunction, useLoaderData } from 'react-router-dom';
import ApplicationForm from '../components/ApplicationForm';
import Layout from '../components/Layout';
import { db } from '../lib/firebase';
import { Job } from '../lib/types';

export default function JobPage() {
  const job = useLoaderData() as Job;

  return (
    <Layout>
      <Container>
        <h1>{job.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: job.description }} />
      </Container>
      <ApplicationForm />
    </Layout>
  );
}

export const loadJob: LoaderFunction = async ({ params }) => {
  const job = await getDoc(doc(db, `jobs/${params.job}`));
  return job.data();
};
