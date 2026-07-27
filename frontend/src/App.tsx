import { ThemeProvider } from "@/components/theme-provider"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import SignupPage from "./pages/Signup"
import { ModeToggle } from "@/components/mode-toggle"
import "./App.css"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="fixed top-4 right-4 z-50">
        <ModeToggle />
      </div>
      <Router>
        <Routes>
          <Route path="/" element={<SignupPage />} />
          {/* Redirect any other unknown path to the default signup route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
