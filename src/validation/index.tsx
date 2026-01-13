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
  
  type: Yup.string()
    .required("Type is required"),
});

export const newspaperValidationSchema = Yup.object().shape({
  title: Yup.string()
    .required("Newspaper title is required")
    .trim()
    .min(3, "Too short title")
    .max(100, "Too long title"),
  
  description: Yup.string()
    .required("Description is required")
    .min(10, "Too short description"),
});

// Validation schema for courses 
export const courseValidationSchema = Yup.object({
  name: Yup.string()
    .required("Course Name is required")
    .min(3, "Too short Name"),

  title: Yup.string()
    .required("Title is required")
    .min(5, "Too short Title"),

  type: Yup.string()
    .required("Type is required"),

  image: Yup.string()
    .required("Image is required"),
});

// Type for book form data
export interface IBookFormData {
  title: string;
  description: string;
  image: string;
  type: string;
}
