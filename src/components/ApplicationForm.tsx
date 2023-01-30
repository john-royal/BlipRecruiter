import { ChangeEvent, useState } from 'react';
import { Form, Button, Container, Modal, Row, Col } from 'react-bootstrap';
import { ref, uploadBytes } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { db, storage } from '../lib/firebase';
import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'react-router-dom';
import { Application } from '../lib/types';

async function submitApplication({ job, name, email, resume }: Application) {
  const id = `applications/${uuidv4()}`;
  await Promise.all([
    setDoc(doc(db, id), { id, job, name, email }),
    uploadBytes(ref(storage, id), resume),
  ]);
}

function ApplicationForm() {
  const { job } = useParams() as { job: string };
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [resume, setResume] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !email || !resume) {
      setErrorMessage('Please enter all required fields.');
      return;
    }

    submitApplication({ job, name, email, resume })
      .then(() => setErrorMessage('Success'))
      .catch((e: Error) => setErrorMessage(e.message));
  };

  return (
    <Container>
      <Row>
        <Col>
          <h2>Apply</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="email" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="resume" className="mb-3">
              <Form.Label>Resume</Form.Label>
              <Form.Control
                type="file"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setResume(e.target.files ? e.target.files[0] : null)
                }
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
      <Modal show={errorMessage !== ''} onHide={() => setErrorMessage('')}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setErrorMessage('')}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ApplicationForm;
