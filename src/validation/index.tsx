import * as Yup from "yup";

// Book validation schema matching backend Mongoose validation
export const bookValidationSchema = Yup.object().shape({
  title: Yup.string()
    .required("Book title is required")
    .trim()
    .min(3, "Too short book title")
    .max(100, "Too long book title"),
  
  description: Yup.string()
    .required("Book description is required")
    .min(20, "Too short book description"),
  
  image: Yup.string()
    .required("Book image is required"),
});

// Type for book form data
export interface IBookFormData {
  title: string;
  description: string;
  image: string;
}
