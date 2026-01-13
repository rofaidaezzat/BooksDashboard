import { useState, useEffect } from "react";
import { useUpdateNewspaperMutation } from "../../app/services/crudNewsPaper";
import Modal from "../Modal";
import toast from "react-hot-toast";
import type { INewspaper } from "../../types/newspaper";
import { newspaperValidationSchema } from "../../validation";

interface UpdateNewsPaperProps {
  isOpen: boolean;
  onClose: () => void;
  newspaper: INewspaper;
}

const UpdateNewsPaper = ({ isOpen, onClose, newspaper }: UpdateNewsPaperProps) => {
  const [updateNewspaper, { isLoading }] = useUpdateNewspaperMutation();
  const [title, setTitle] = useState(newspaper.title);
  const [description, setDescription] = useState(newspaper.description);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen && newspaper) {
      setTitle(newspaper.title);
      setDescription(newspaper.description);
      setErrors({});
    }
  }, [isOpen, newspaper]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      await newspaperValidationSchema.validate(
        {
          title: title.trim(),
          description,
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

    try {
      await updateNewspaper({ 
        id: newspaper._id, 
        body: { title: title.trim(), description } 
      }).unwrap();
      toast.success("Newspaper updated successfully");
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to update newspaper");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Newspaper">
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
            {isLoading ? "Updating..." : "Update Newspaper"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateNewsPaper;
