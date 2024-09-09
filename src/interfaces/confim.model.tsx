import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Report: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleDownload = () => {
    console.log('Downloading report...');
    setShowModal(false); 
  };

  const handleConfirm = () => {
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
    navigate('/employee'); 
  };

  return (
    <>
      <Button variant="primary" onClick={handleConfirm}>
        הורד דוח לאקסל
      </Button>

      <Modal show={showModal} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>אישור הורדת דוח</Modal.Title>
        </Modal.Header>
        <Modal.Body>תרצה להוריד את הדוח לאקסל?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            ביטול
          </Button>
          <Button variant="primary" onClick={handleDownload}>
            הורד דוח
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Report;
