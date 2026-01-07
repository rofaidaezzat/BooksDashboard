import { useDeleteMessageMutation } from "../../app/services/crudContactus";
import Modal from "../Modal";
import toast from "react-hot-toast";

interface DeleteMessageProps {
  isOpen: boolean;
  onClose: () => void;
  messageId: string;
  messageName: string;
}

const DeleteMessage = ({ isOpen, onClose, messageId, messageName }: DeleteMessageProps) => {
  const [deleteMessage, { isLoading }] = useDeleteMessageMutation();

  const handleDelete = async () => {
    try {
      await deleteMessage(messageId).unwrap();
      toast.success("Message deleted successfully");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete message");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Message">
      <div className="space-y-4">
        <p className="text-gray-600">
          Are you sure you want to delete the message from <span className="font-semibold text-gray-900">"{messageName}"</span>? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteMessage;
