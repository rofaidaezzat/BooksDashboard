import Modal from "../Modal";
import type { INewspaper } from "../../types/newspaper";

interface ViewNewsPaperProps {
  isOpen: boolean;
  onClose: () => void;
  newspaper: INewspaper;
}

const ViewNewsPaper = ({ isOpen, onClose, newspaper }: ViewNewsPaperProps) => {

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Newspaper Details">
      <div className="space-y-6">


        {/* Information */}
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
              Title
            </label>
            <p className="text-lg font-bold text-gray-900 mt-1">{newspaper.title}</p>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
              Description
            </label>
            <p className="text-gray-700 mt-1 leading-relaxed">
              {newspaper.description || "No description available."}
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div>
              <label className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
                Created
              </label>
              <p className="text-gray-700 mt-1">{formatDate(newspaper.createdAt)}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
                Updated
              </label>
              <p className="text-gray-700 mt-1">{formatDate(newspaper.updatedAt)}</p>
            </div>
          </div>

          {/* Slug */}
          {newspaper.slug && (
            <div>
              <label className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
                Slug
              </label>
              <p className="text-gray-600 mt-1 font-mono text-sm">{newspaper.slug}</p>
            </div>
          )}
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

export default ViewNewsPaper;
