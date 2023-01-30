import { collection, getDocs } from 'firebase/firestore';
import { Container } from 'react-bootstrap';
import { useLoaderData } from 'react-router-dom';
import Layout from '../components/Layout';
import { db } from '../lib/firebase';
import { Job } from '../lib/types';

export default function JobsList() {
  const jobs = useLoaderData() as Job[];

  return (
    <Layout>
      <Container>
        <h1>Jobs</h1>
        <ul>
          {jobs.map((job) => (
            <li key={job.id}>
              <a href={`/${job.id}`}>{job.title}</a>
            </li>
          ))}
        </ul>
      </Container>
    </Layout>
  );
}

export async function loadJobs() {
  const jobs = await getDocs(collection(db, 'jobs'));
  return jobs.docs.map((job) => job.data());
}
