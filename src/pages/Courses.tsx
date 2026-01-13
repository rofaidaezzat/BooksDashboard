import { useState } from "react";
import { useGetAllCoursesQuery } from "../app/services/crudCourses";
import Table from "../components/Table";
import Pagination from "../components/Pagination";
import CreateCourse from "../components/ModalCourses/CreateCourse";
import UpdateCourse from "../components/ModalCourses/UpdateCourse";
import DeleteCourse from "../components/ModalCourses/DeleteCourse";
import ViewCourse from "../components/ModalCourses/ViewCourse";
import type { ICourse } from "../types/courses";

const Courses = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const sortBy = "-createdAt";

  const { data, isLoading, refetch } = useGetAllCoursesQuery({
    page: currentPage,
    keyword: searchKeyword || undefined,
    sort: sortBy,
  });

  const handleView = (course: ICourse) => {
    setSelectedCourse(course);
    setIsViewModalOpen(true);
  };

  const handleEdit = (course: ICourse) => {
    setSelectedCourse(course);
    setIsEditModalOpen(true);
  };

  const handleDelete = (course: ICourse) => {
    setSelectedCourse(course);
    setIsDeleteModalOpen(true);
  };

  const columns = [
    {
      header: "Image",
      accessor: (row: ICourse) => (
        <img
          src={row.image || ""}
          alt={row.name}
          className="w-12 h-16 object-cover rounded shadow-sm border border-gray-100"
        />
      ),
    },
    {
      header: "Course Name",
      accessor: (row: ICourse) => (
        <span className="font-semibold text-purple-900">{row.name}</span>
      ),
    },
    {
      header: "Title",
      accessor: (row: ICourse) => row.title,
    },
    {
      header: "Type",
      accessor: (row: ICourse) => (
        <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
          {row.type}
        </span>
      ),
    },
    {
      header: "Date",
      accessor: (row: ICourse) => new Date(row.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <div>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-purple-900 tracking-tight">Courses</h1>
          <p className="text-purple-500 mt-1 font-medium">Manage your educational courses</p>
        </div>
        <button
          onClick={() => {
            setIsCreateModalOpen(true);
          }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 font-medium"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add New Course
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 max-w-2xl">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search courses by name or title..."
            className="block w-full pl-10 pr-3 py-4 border-none rounded-2xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 sm:text-sm transition-all shadow-sm hover:shadow-md"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
      </div>

      {/* Table Content */}
      <div className="space-y-4">
        <Table
          data={data?.data || []}
          columns={columns}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
        {data?.pagination && (
          <Pagination
            currentPage={data.pagination.currentPage}
            totalPages={data.pagination.numberOfPages}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            isLoading={isLoading}
          />
        )}
      </div>

      <CreateCourse
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          refetch();
        }}
      />

      {selectedCourse && (
        <>
          <ViewCourse
            isOpen={isViewModalOpen}
            onClose={() => {
              setIsViewModalOpen(false);
              setSelectedCourse(null);
            }}
            course={selectedCourse}
          />

          <UpdateCourse
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedCourse(null);
              refetch();
            }}
            course={selectedCourse}
          />

          <DeleteCourse
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedCourse(null);
              refetch();
            }}
            courseId={selectedCourse._id}
            courseName={selectedCourse.name}
          />
        </>
      )}
    </div>
  );
};

export default Courses;
