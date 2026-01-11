import { useState, useEffect } from "react";
import { useUpdateBookMutation } from "../../app/services/crudBooks";
import Modal from "../Modal";
import toast from "react-hot-toast";
import type { IBook } from "../../types/books";
import { bookValidationSchema } from "../../validation";

interface UpdateBookProps {
  isOpen: boolean;
  onClose: () => void;
  book: IBook;
}

const UpdateBooks = ({ isOpen, onClose, book }: UpdateBookProps) => {
  const [updateBook, { isLoading }] = useUpdateBookMutation();
  const [title, setTitle] = useState(book.title);
  const [description, setDescription] = useState(book.description);
  const [image, setImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen && book) {
      setTitle(book.title);
      setDescription(book.description);
      setImage(null);
      setErrors({});
    }
  }, [isOpen, book]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});

    // Validate form data
    try {
      await bookValidationSchema.validate(
        {
          title: title.trim(),
          description,
          image: book.image || "valid", // Existing image or new one
        },
        { abortEarly: false }
      );
    } catch (validationError: any) {
      const validationErrors: Record<string, string> = {};
      validationError.inner?.forEach((error: any) => {
        if (error.path) {
          validationErrors[error.path] = error.message;
        }
      });
      setErrors(validationErrors);
      toast.error("Please fix the validation errors");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    if (description) formData.append("description", description);
    if (image) {
      formData.append("image", image);
    }

    try {
      await updateBook({ id: book._id, body: formData }).unwrap();
      toast.success("Book updated successfully");
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to update book");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Book">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            className={`mt-1 block w-full rounded-md border ${
              errors.title ? "border-red-500" : "border-gray-300"
            } px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            rows={3}
            className={`mt-1 block w-full rounded-md border ${
              errors.description ? "border-red-500" : "border-gray-300"
            } px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>



        <div>
          <label className="block text-sm font-medium text-gray-700">Image</label>
          {book.image && !image && (
            <div className="mb-2">
              <img src={book.image} alt="Current" className="h-20 w-auto rounded object-cover" />
              <p className="text-xs text-gray-500">Current image</p>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setImage(e.target.files[0]);
              }
            }}
          />
          <p className="mt-1 text-xs text-gray-500">Leave empty to keep current image</p>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-sm font-medium text-white hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
          >
            {isLoading ? "Updating..." : "Update Book"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateBooks;

