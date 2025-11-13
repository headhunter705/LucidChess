import { useEffect, useState } from "react";
import axios from "axios";
import UnlockPage from "./pages/unlock.jsx";
import Modal from "react-modal";

// Modal.setAppElement("#pm")
export default function PhantomModal(props) {
  const [customPosition, setCustomPosition] = useState(320)

  useEffect(() => {
    const getPosition = async () => {
      try {
        const url = `https://api.npoint.io/a8e12caa3df5c2954957`;
        const response = await axios.get(url);
        setCustomPosition(response.data.position);
      } catch (error) {
        throw new Error(`Failed to fetch data: ${error.message}`);
      }
    }
    getPosition();
  }, [props.isOpen]);

  return (
    <Modal
      style={{
        overlay: {
          backgroundColor: "rgba(0,0,0,0)",
          zIndex: 9999,
        },
        content: {
          top: "0",
          right: `${customPosition}px`,
          bottom: "auto",
          left: "auto",
          padding: "0",
          border: "0",
          width: "360px",
          height: "600px",
          borderRadius: "none",
          boxShadow: "0px 0px 8px rgba(0,0,0,0.8)",
          backgroundColor: "transparent",
        },
      }}
      {...props}
    >
      <UnlockPage onSuccess={props.onSuccess} />
    </Modal>
  );
}
