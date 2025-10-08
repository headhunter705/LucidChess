import UnlockPage from "./pages/unlock.jsx";
import Modal from "react-modal";

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0,0,0,0)",
    zIndex: 9999,
  },
  content: {
    top: "0",
    right: "100px",
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
};

// Modal.setAppElement("#pm")
export default function PhantomModal(props) {
  return (
    <Modal style={customStyles} {...props}>
      <UnlockPage />
    </Modal>
  );
}
