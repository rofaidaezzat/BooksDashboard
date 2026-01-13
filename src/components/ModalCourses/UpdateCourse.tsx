import { useState, useEffect } from "react";
import { useUpdateCourseMutation } from "../../app/services/crudCourses";
import Modal from "../Modal";
import toast from "react-hot-toast";
import type { ICourse } from "../../types/courses";
import { courseValidationSchema } from "../../validation";

interface UpdateCourseProps {
  isOpen: boolean;
  onClose: () => void;
  course: ICourse;
}

const UpdateCourse = ({ isOpen, onClose, course }: UpdateCourseProps) => {
  const [updateCourse, { isLoading }] = useUpdateCourseMutation();
  const [name, setName] = useState(course.name);
  const [title, setTitle] = useState(course.title);
  const [type, setType] = useState(course.type);
  const [image, setImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen && course) {
      setName(course.name);
      setTitle(course.title);
      setType(course.type);
      setImage(null);
      setErrors({});
    }
  }, [isOpen, course]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      await courseValidationSchema.validate(
        {
          name: name.trim(),
          title: title.trim(),
          type: type.trim(),
          image: image ? "valid" : course.image,
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
    formData.append("name", name.trim());
    formData.append("title", title.trim());
    formData.append("type", type.trim());
    if (image) {
      formData.append("image", image);
    }

    try {
      await updateCourse({ id: course._id, body: formData }).unwrap();
      toast.success("Course updated successfully");
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to update course");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Course">
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
          {course.image && !image && (
            <div className="mb-2">
              <img src={course.image} alt="Current" className="h-20 w-auto rounded object-cover" />
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
            {isLoading ? "Updating..." : "Update Course"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateCourse;
