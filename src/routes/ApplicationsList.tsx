import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  QuerySnapshot,
  where,
} from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import { Container } from 'react-bootstrap';
import { LoaderFunction, useLoaderData } from 'react-router-dom';
import Layout from '../components/Layout';
import { db, storage } from '../lib/firebase';
import { Application, Job } from '../lib/types';

export default function ApplicationsList() {
  const jobs = useLoaderData() as Array<Job & { applications: Application[] }>;

  return (
    <Layout>
      <Container>
        <h1>Applications</h1>
        {jobs.map((job) => (
          <section key={job.id} className="mt-3">
            <h2>{job.title}</h2>
            {job.applications.map((application) => (
              <li key={application.id}>
                <a href={application.resume}>
                  {application.name} ({application.email})
                </a>
              </li>
            ))}
          </section>
        ))}
      </Container>
    </Layout>
  );
}

const transformDocuments = (snapshot: QuerySnapshot) =>
  snapshot.docs.map((doc) => doc.data());

export const loadApplications: LoaderFunction = async ({ params }) => {
  const jobs = await getDocs(query(collection(db, 'jobs'))).then((snapshot) =>
    snapshot.docs.map((doc) => doc.data())
  );
  const applications = await getDocs(
    query(collection(db, 'applications'))
  ).then((snapshot) =>
    snapshot.docs.map((doc) => {
      const application: Application = doc.data();
      const resume = getDownloadURL(ref(storage, application.id));
      return { ...application, resume };
    })
  );

  return jobs.map((job) => {
    return {
      ...job,
      applications: applications.filter(
        (application) => application.job === job.id
      ),
    };
  });
};
