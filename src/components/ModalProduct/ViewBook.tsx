import Modal from "../Modal";
import type { IBook } from "../../types/books";

interface ViewBookProps {
  isOpen: boolean;
  onClose: () => void;
  book: IBook;
}

const ViewBook = ({ isOpen, onClose, book }: ViewBookProps) => {


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Book Details">
      <div className="space-y-6">
        {/* Book Image */}
        {book.image && (
          <div className="flex justify-center">
            <img
              src={book.image}
              alt={book.title}
              className="w-full max-w-sm h-64 object-cover rounded-xl shadow-lg border border-purple-100"
            />
          </div>
        )}

        {/* Book Information */}
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
              Title
            </label>
            <p className="text-lg font-bold text-gray-900 mt-1">{book.title}</p>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
              Description
            </label>
            <p className="text-gray-700 mt-1 leading-relaxed">
              {book.description || "No description available."}
            </p>
          </div>



          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div>
              <label className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
                Created
              </label>
              <p className="text-gray-700 mt-1">{formatDate(book.createdAt)}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
                Updated
              </label>
              <p className="text-gray-700 mt-1">{formatDate(book.updatedAt)}</p>
            </div>
          </div>

          {/* Slug */}
          {book.slug && (
            <div>
              <label className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
                Slug
              </label>
              <p className="text-gray-600 mt-1 font-mono text-sm">{book.slug}</p>
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

export default ViewBook;
