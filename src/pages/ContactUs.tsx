import { useState } from "react";
import { useGetAllmessageQuery } from "../app/services/crudContactus";
import Table from "../components/Table";
import Pagination from "../components/Pagination";
import DeleteMessage from "../components/ModalContact/DeleteMessage";
import ViewMessage from "../components/ModalContact/ViewMessage";

// Using IBook type temporarily since the API returns similar structure
// You may want to create a separate IMessage type later

const ContactUs = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const sortBy = "-createdAt";

  const { data, isLoading, refetch } = useGetAllmessageQuery({
    page: currentPage,
    keyword: searchKeyword || undefined,
    sort: sortBy,
  });

  const handleView = (message: any) => {
    setSelectedMessage(message);
    setIsViewModalOpen(true);
  };

  const handleDelete = (message: any) => {
    setSelectedMessage(message);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedMessage(null);
    refetch();
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedMessage(null);
  };

  const columns = [
    {
      header: "Name",
      accessor: (row: any) => (
        <span className="font-semibold text-purple-900">{row.name || "N/A"}</span>
      ),
    },
    {
      header: "Email",
      accessor: (row: any) => (
        <span className="text-gray-700">{row.email || "N/A"}</span>
      ),
    },
    {
      header: "Message",
      accessor: (row: any) => {
        const message = row.message || "No message";
        const truncated = message.length > 50 ? message.substring(0, 50) + "..." : message;
        return (
          <span className="text-gray-600 text-sm" title={message}>
            {truncated}
          </span>
        );
      },
    },
    {
      header: "Date",
      accessor: (row: any) => (
        <span className="text-gray-500 text-sm">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-purple-900 tracking-tight">Contact Messages</h1>
          <p className="text-purple-500 mt-1 font-medium">View and manage customer inquiries</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-8 max-w-2xl">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search messages..."
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

      {/* View Modal */}
      {selectedMessage && (
        <ViewMessage
          isOpen={isViewModalOpen}
          onClose={handleCloseViewModal}
          message={selectedMessage}
        />
      )}

      {/* Delete Modal */}
      {selectedMessage && (
        <DeleteMessage
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          messageId={selectedMessage._id}
          messageName={selectedMessage.name || "Unknown"}
        />
      )}
    </div>
  );
};

export default ContactUs;

