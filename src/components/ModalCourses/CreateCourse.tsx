import { useState } from "react";
import { useCreateCourseMutation } from "../../app/services/crudCourses";
import Modal from "../Modal";
import toast from "react-hot-toast";
import { courseValidationSchema } from "../../validation";

interface CreateCourseProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateCourse = ({ isOpen, onClose }: CreateCourseProps) => {
  const [createCourse, { isLoading }] = useCreateCourseMutation();
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      await courseValidationSchema.validate(
        {
          name: name.trim(),
          title: title.trim(),
          type: type.trim(),
          image: image ? "valid" : "",
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
      setErrors({ image: "Image is required" });
      toast.error("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("title", title.trim());
    formData.append("type", type.trim());
    formData.append("image", image);

    try {
      await createCourse(formData).unwrap();
      toast.success("Course created successfully");
      setName("");
      setTitle("");
      setType("");
      setImage(null);
      setErrors({});
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to create course");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Course">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Course Name</label>
          <input
            type="text"
            className={`mt-1 block w-full rounded-md border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500`}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

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
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            className={`mt-1 block w-full rounded-md border ${
              errors.type ? "border-red-500" : "border-gray-300"
            } px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500`}
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">Select Type</option>
            <option value="دوره تدريبيه">دوره تدريبيه</option>
            <option value="برامج تدريبه">برامج تدريبه</option>
            <option value="ورش عمل">ورش عمل</option>
            <option value="الدبلومات المهنيه">الدبلومات المهنيه</option>
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type}</p>
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
            {isLoading ? "Creating..." : "Create Course"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateCourse;
