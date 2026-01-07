import { useState } from "react";
import { useCreateBookMutation } from "../../app/services/crudBooks";
import Modal from "../Modal";
import toast from "react-hot-toast";
import { bookValidationSchema } from "../../validation";

interface CreateNewBookProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateNewBook = ({ isOpen, onClose }: CreateNewBookProps) => {
  const [createBook, { isLoading }] = useCreateBookMutation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
          price: parseFloat(price),
          image: image ? "valid" : "", // Just check if image exists
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

    if (!image) {
      setErrors({ image: "Book image is required" });
      toast.error("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description);
    formData.append("price", price);
    formData.append("image", image);

    try {
      await createBook(formData).unwrap();
      toast.success("Book created successfully");
      setTitle("");
      setDescription("");
      setPrice("");
      setImage(null);
      setErrors({});
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to create book");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Book">
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
          <label className="block text-sm font-medium text-gray-700">Price (EGP)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            className={`mt-1 block w-full rounded-md border ${
              errors.price ? "border-red-500" : "border-gray-300"
            } px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500`}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Image</label>
          <input
            type="file"
            accept="image/*"
            className={`mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold ${
              errors.image
                ? "file:bg-red-50 file:text-red-700"
                : "file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            }`}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setImage(e.target.files[0]);
                setErrors({ ...errors, image: "" });
              }
            }}
          />
          {errors.image && (
            <p className="mt-1 text-sm text-red-600">{errors.image}</p>
          )}
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
            {isLoading ? "Creating..." : "Create Book"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateNewBook;

