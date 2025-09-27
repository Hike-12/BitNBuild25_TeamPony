import React from "react";
import { FaMicrophone } from "react-icons/fa";
import PropTypes from "prop-types";

// VoiceRouter: Button for voice navigation between routes
const VoiceRouter = ({ routes }) => {
  // Placeholder for voice routing logic
  // You can implement speech recognition and route matching here
  const handleVoiceCommand = () => {
    alert("Voice routing coming soon!");
  };

  return (
    <button
      onClick={handleVoiceCommand}
      className="mr-4 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 shadow hover:scale-105 transition-all"
      style={{ backgroundColor: "#f3f4f6", color: "#18181b" }}
      aria-label="Voice Navigation"
    >
      <FaMicrophone /> Voice Route
    </button>
  );
};

VoiceRouter.propTypes = {
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      keyword: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default VoiceRouter;
