import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#3c3f41',
    borderRadius: '10px',
    padding: '30px',
    textAlign: 'center',
    border: '4px solid #805AD5',
    color: 'white',
    fontSize: '22px',
  },
  button: {
    backgroundColor: '#805AD5',
    border: 'none',
    borderRadius: '5px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '16px',
    padding: '10px 20px',
    margin: '20px 0',
  },
  heading: {
    color: 'white',
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  list: {
    color: 'white',
    fontSize: '18px',
  },
};

const AddToHomeScreenButton = () => {
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [buttonText, setButtonText] = useState('Add to Desktop');

  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    const iOS = /iPad|iPhone|iPod/.test(userAgent);
    const Android = /Android/.test(userAgent);

    setIsIOS(iOS);
    setIsAndroid(Android);
    setButtonText(iOS || Android ? 'Add to Home Screen' : 'Add to Desktop');
  }, []);

  const handleButtonClick = () => {
    if (isIOS) {
      setModalContent(`
        
        <ol>
          <li>swipe Down to make sure task bar is visable </li>
          <li>Tap the share icon at the bottom of the screen (it looks like a square with an arrow pointing upward).</li>
          <li>Scroll down and tap "Add to Home Screen".</li>
          <li>Choose a name for the shortcut and tap "Add" to finish.</li>
        </ol>
      `);
    } else if (isAndroid) {
      setModalContent(`
        
        <ol>
          <li>Tap the menu button (three vertical dots) at the top-right corner of the screen.</li>
          <li>Tap "Add to Home screen".</li>
          <li>Choose a name for the shortcut and tap "Add" to finish.</li>
        </ol>
      `);
    } else {
      setModalContent(`
      
      <ol>
        <li>Click in address/search bar highlight URL </li>
        <li>Resize the browser window so that you can see the desktop.</li>
        <li>Click and drag the website's icon from the address bar to the desktop.</li>
      </ol>
      <h1>OR</h1>
      <ol>
        <li>click in the top right icon to share (arrow pointing right in a box)</li> 
        <li>click save page as ...</li>
        <li>Make sure to save page in desktop</li>
      `);
    }
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <>
       <button onClick={handleButtonClick} style={customStyles.button}>
        {buttonText}
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{ content: customStyles.content }}
        contentLabel="Add to Home Screen Instructions"
      >
        <div dangerouslySetInnerHTML={{ __html: modalContent }} />
        <button onClick={closeModal} style={customStyles.button}>
          Close
        </button>
        </Modal>
    </>
  );
};

export default AddToHomeScreenButton;
