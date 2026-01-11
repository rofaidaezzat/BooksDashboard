import { useState } from "react";
import { useGetAllBooksQuery } from "../app/services/crudBooks";
import Table from "../components/Table";
import Pagination from "../components/Pagination";
// import SearchAndSort from "../components/SearchAndSort";
import CreateNewBook from "../components/ModalProduct/CreateNewBook";
import UpdateBooks from "../components/ModalProduct/UpdateBooks";
import DeleteBooks from "../components/ModalProduct/DeleteBooks";
import ViewBook from "../components/ModalProduct/ViewBook";
// import toast from "react-hot-toast";
import type { IBook } from "../types/books";

// Mocking missing components for now or just commenting them out
// If SearchAndSort is missing, we will implement a simple input field if needed, or skip it.
// Assuming Pagination exists as per directory list.

const Products = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IBook | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  // const [sortBy, setSortBy] = useState("-createdAt");
  const sortBy = "-createdAt";

  const { data, isLoading, refetch } = useGetAllBooksQuery({
    page: currentPage,
    keyword: searchKeyword || undefined,
    sort: sortBy,
  });

  const handleView = (product: IBook) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };

  const handleEdit = (product: IBook) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDelete = (product: IBook) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };


  const columns = [
    {
      header: "Image",
      accessor: (row: IBook) => (
        <img
          src={row.image || ""}
          alt={row.title}
          className="w-12 h-16 object-cover rounded shadow-sm border border-gray-100"
        />
      ),
    },
    { 
      header: "Title", 
      accessor: (row: IBook) => (
        <span className="font-semibold text-purple-900">{row.title}</span>
      )
    },
    // Category is not in the IBook interface from API response
    // {
    //   header: "Category",
    //   accessor: (row: IBook) => row.category, 
    // },

    // Stock and SalesCount not in API response
    // { header: "Stock", accessor: "stock" as keyof IBook },
    
    {
        header: "Date",
        accessor: (row: IBook) => new Date(row.createdAt).toLocaleDateString()
    }
  ];

  return (
    <div>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-purple-900 tracking-tight">Dr. Nelly's Books</h1>
          <p className="text-purple-500 mt-1 font-medium">Manage your inventory and book details</p>
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
          Add New Book
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 max-w-2xl">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="Search books by title..." 
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

      <CreateNewBook 
        isOpen={isCreateModalOpen}
        onClose={() => {
            setIsCreateModalOpen(false);
            refetch();
        }}
      />

      {selectedProduct && (
        <>
          <ViewBook
            isOpen={isViewModalOpen}
            onClose={() => {
              setIsViewModalOpen(false);
              setSelectedProduct(null);
            }}
            book={selectedProduct}
          />

          <UpdateBooks
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedProduct(null);
              refetch();
            }}
            book={selectedProduct}
          />
        </>
      )}

      {selectedProduct && selectedProduct._id && (
        <DeleteBooks
            isOpen={isDeleteModalOpen}
            onClose={() => {
                setIsDeleteModalOpen(false);
                setSelectedProduct(null);
                refetch();
            }}
            bookId={selectedProduct._id}
            bookTitle={selectedProduct.title}
        />
      )}
    </div>
  );
};

export default Products;
