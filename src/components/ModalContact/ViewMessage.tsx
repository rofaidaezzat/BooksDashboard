import Modal from "../Modal";

interface ViewMessageProps {
  isOpen: boolean;
  onClose: () => void;
  message: any;
}

const ViewMessage = ({ isOpen, onClose, message }: ViewMessageProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Message Details">
      <div className="space-y-6">
        {/* Message Information */}
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
              Name
            </label>
            <p className="text-lg font-bold text-gray-900 mt-1">{message.name}</p>
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
              Email
            </label>
            <p className="text-gray-700 mt-1">
              <a href={`mailto:${message.email}`} className="text-purple-600 hover:text-purple-800 hover:underline">
                {message.email}
              </a>
            </p>
          </div>

          {/* Message */}
          <div>
            <label className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
              Message
            </label>
            <p className="text-gray-700 mt-1 leading-relaxed whitespace-pre-wrap">
              {message.message || "No message provided."}
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div>
              <label className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
                Received
              </label>
              <p className="text-gray-700 mt-1">{formatDate(message.createdAt)}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
                Message ID
              </label>
              <p className="text-gray-600 mt-1 font-mono text-sm truncate">{message._id}</p>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ViewMessage;
