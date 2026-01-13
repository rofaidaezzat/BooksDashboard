import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Products from './pages/Products'
import ContactUs from './pages/ContactUs'
import Login from './pages/Login'
import NewsPaper from './pages/NewsPaper'
import Courses from './pages/Courses'
import Layout from './components/Layout'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard/products" replace />} />
          <Route path="products" element={<Products />} />
          <Route path="contactus" element={<ContactUs />} />
          <Route path="newsPaper" element={<NewsPaper />} />
          <Route path="courses" element={<Courses />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster position="top-right" />
    </BrowserRouter>
  )
}

export default App
