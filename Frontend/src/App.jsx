import React from 'react'
import { Toaster } from 'react-hot-toast'
import { ThemeToggle } from "./components/theme-toggle"
import Signup from './pages/Signup'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import CreateRecipe from './pages/CreateRecipe'
import AllRecipes from './pages/AllRecipes'
import RecipeDetail from './pages/RecipeDetail'
import { AuthProvider } from './context/AuthContext'
import Categories from './pages/Categories'
import AIRecipeMaker from './pages/AIRecipeMaker'
const App = () => {
  return (
    <div className="font-sans transition-colors duration-300">
      <AuthProvider>
        <ThemeToggle />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-recipe" element={<CreateRecipe />} />
          <Route path="/recipes" element={<AllRecipes />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/ai-chef" element={<AIRecipeMaker />} />


        </Routes>
        <Toaster position="top-center" reverseOrder={false} />
      </AuthProvider>
    </div>
  )
}

export default App
