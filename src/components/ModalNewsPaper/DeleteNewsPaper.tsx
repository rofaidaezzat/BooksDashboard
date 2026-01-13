import { useDeleteNewspaperMutation } from "../../app/services/crudNewsPaper";
import Modal from "../Modal";
import toast from "react-hot-toast";

interface DeleteNewsPaperProps {
  isOpen: boolean;
  onClose: () => void;
  newspaperId: string;
  newspaperTitle: string;
}

const DeleteNewsPaper = ({
  isOpen,
  onClose,
  newspaperId,
  newspaperTitle,
}: DeleteNewsPaperProps) => {
  const [deleteNewspaper, { isLoading }] = useDeleteNewspaperMutation();

  const handleDelete = async () => {
    try {
      await deleteNewspaper(newspaperId).unwrap();
      toast.success("Newspaper deleted successfully");
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to delete newspaper");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Newspaper">
      <div className="space-y-4">
        <p className="text-gray-600">
          Are you sure you want to delete the newspaper{" "}
          <span className="font-bold text-gray-900">"{newspaperTitle}"</span>?
          This action cannot be undone.
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

export default DeleteNewsPaper;
