import { useDeleteCourseMutation } from "../../app/services/crudCourses";
import Modal from "../Modal";
import toast from "react-hot-toast";

interface DeleteCourseProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseName: string;
}

const DeleteCourse = ({ isOpen, onClose, courseId, courseName }: DeleteCourseProps) => {
  const [deleteCourse, { isLoading }] = useDeleteCourseMutation();

  const handleDelete = async () => {
    try {
      await deleteCourse(courseId).unwrap();
      toast.success("Course deleted successfully");
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to delete course");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Course">
      <div className="space-y-4">
        <div className="bg-red-50 p-4 rounded-lg flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-red-800">Warning</h3>
            <p className="mt-2 text-sm text-red-700">
              Are you sure you want to delete the course <span className="font-bold">"{courseName}"</span>? This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? "Deleting..." : "Delete Course"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteCourse;
