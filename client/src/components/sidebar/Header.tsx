import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { logout } from "../../redux/slicers/userSlice";
import { AppDispatch } from "../../redux/store";
import { user } from "../../type";



const Header = () => {
    const dispatch = useDispatch<AppDispatch>()
    const userSlice = useSelector((state: { userSlice: { loading: boolean, user: user, error: string, success: boolean } }) => state.userSlice)
    const { user } = userSlice
    const userInfo = JSON.parse(localStorage.getItem("user") || "null");
    const handleLogout = () => {
        dispatch(logout())
        window.location.href = '/login'
    };
    return (
        <div className="flex items-center gap-6 shadow-md border-b-2 bg-gray-950">
            <div className='flex items-center justify-between w-full p-4 '>

                <div className="flex items-center gap-4">
                    <div className='flex items-center gap-2'>
                        <img
                            src="https://cdn-icons-png.freepik.com/256/12105/12105601.png?semt=ais_hybrid"
                            alt="Cloud"
                            className="h-10 w-10"
                        />
                        <h1 className="text-xl text-blue-400 border-b-8 border-blue-400 font-medium">Cloud Files</h1>
                    </div>
                    {
                        (user == null || userInfo) && (
                            <a href="/" className="text-xl hover:text-blue-500  font-medium text-white p-2 rounded-md shadow-md">My Files</a>
                        )
                    }

                </div>
                <div className="flex">
                    <div className="text-sm">
                        {
                            (user != null || userInfo) && (
                                <div className="flex gap-2">
                                    <div className="text-muted-foreground text-md text-white font-medium  rounded-md p-2 border-2 border-blue-950 bg-blue-900 shadow-md">{userInfo?.createdUser?.username}</div>
                                    <Button variant={'destructive'} onClick={() => handleLogout()}>Logout</Button>
                                </div>
                            )
                        }

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header