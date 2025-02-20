

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SignInForm from './pages/auth/Sign'
import SignUp from './pages/auth/SignUp'
import Share from './pages/file-share/Shar'
import Folder from './pages/file-share/Folder'
import Header from './components/sidebar/Header'
import { useSelector } from 'react-redux'
import { user } from './type'
function App() {
  const userInfo = JSON.parse(localStorage.getItem("user") || "null");
  const userSlice = useSelector((state: { userSlice: { loading: boolean, user: user, error: string, success: boolean } }) => state.userSlice)
  const { user } = userSlice


  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/login' element={user || userInfo ? <Share /> : <SignInForm />}></Route>
        <Route path='/register' element={user || userInfo ? <Share /> : <SignUp />}></Route>
        <Route path='/' element={user != null || userInfo ? <Share /> : <SignInForm />}></Route>
        <Route path='/share/:id' element={<Folder />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
