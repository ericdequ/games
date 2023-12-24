import React, { useEffect, useRef,useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button
  } from '@chakra-ui/react';
  const WinLoseModal = ({ videoUrl, isOpen, closeModal }) => {
    const videoRef = useRef(null);
    const [isVideoReady, setIsVideoReady] = useState(false);

    useEffect(() => {
      if (isOpen && videoUrl) {
        setIsVideoReady(true);
      } else {
        setIsVideoReady(false);
      }
    }, [isOpen, videoUrl]);

    useEffect(() => {
      if (isVideoReady && videoRef.current) {
        videoRef.current.play().catch(error => console.error('Error playing video:', error));
      }
    }, [isVideoReady]);

    const handleVideoEnd = () => {
      setIsVideoReady(false);
      closeModal();
    };
  
    return (
      <>
        <Modal isOpen={isOpen} onClose={closeModal} isCentered>
          <ModalOverlay />
          <ModalContent className="z-50">
            <ModalCloseButton />
            <ModalBody>
              {videoUrl && (
                <video
                  ref={videoRef}
                  width="100%"
                  height="100%"
                  src={videoUrl}
                  onEnded={handleVideoEnd}
                  controls
                />
              )}
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="red" onClick={closeModal}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
};

export default WinLoseModal;