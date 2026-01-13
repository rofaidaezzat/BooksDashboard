import Modal from "../Modal";
import type { ICourse } from "../../types/courses";

interface ViewCourseProps {
  isOpen: boolean;
  onClose: () => void;
  course: ICourse;
}

const ViewCourse = ({ isOpen, onClose, course }: ViewCourseProps) => {
  if (!course) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Course Details">
      <div className="space-y-6">
        {course.image && (
          <div className="flex justify-center">
            <img
              src={course.image}
              alt={course.name}
              className="w-full max-w-sm h-64 object-cover rounded-xl shadow-lg border border-purple-100"
            />
          </div>
        )}

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Course Name</h3>
            <p className="mt-1 text-lg font-semibold text-gray-900">{course.name}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Title</h3>
            <p className="mt-1 text-lg font-semibold text-gray-900">{course.title}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Type</h3>
            <span className="mt-1 px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
              {course.type}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div>
              <h3 className="text-xs font-medium text-gray-500 uppercase">Created</h3>
              <p className="text-sm text-gray-900">{new Date(course.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="text-xs font-medium text-gray-500 uppercase">Last Updated</h3>
              <p className="text-sm text-gray-900">{new Date(course.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ViewCourse;
