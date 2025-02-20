"use client"

import { useState } from "react"

import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "../../redux/store"
import { user } from "../../type"
import Loader from "../../components/sidebar/Loader"
import Error from "../../components/sidebar/Error"
import { loginUser } from "../../redux/slicers/userSlice"



export default function SignInForm() {
    const dispatch = useDispatch<AppDispatch>()
    const userSlice = useSelector((state: { userSlice: { loading: boolean, user: user, error: string, success: boolean } }) => state.userSlice)
    const { loading, error, user: createdUser } = userSlice
    const [user, setUser] = useState({
        username: '',
        password: '',
    });
    const [err, setErr] = useState<string>('')

    const handleChange = (e: React.FormEvent) => {
        const { name, value } = e.target as HTMLInputElement;
        setUser({ ...user, [name]: value });
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log(user);
        if (user.password.length < 6 || user.password == '') {
            setErr('please password musr be at least 6 charcters')
        }
        dispatch(loginUser(user))

        setUser({
            username: '',
            password: ''
        })
        if (createdUser) {
            window.location.href = '/'
        }
    }

    return (
        <div className="mt-20  max-w-6xl grid grid-cols-3  justify-center items-center max-md:grid-cols-1 mx-auto max-xl:mr-8 max-xl:ml-10  gap-6 max-md:p-6   bg-white  shadow-lg rounded-lg ">

            <div className="p-6 flex flex-col gap-4 max-md:p-6">
                <div className="space-y-2 text-left text-blue-600">
                    {
                        error && <Error message={error} />
                    }
                    <h1 className="text-3xl font-bold ">Sign in to your account</h1>
                </div>
                {
                    err != '' ? (
                        <Error message={err} />

                    ) : null
                }

                {
                    loading ? <Loader /> : (

                        <>

                            <form className="space-y-4 w-full flex flex-col gap-4  " onSubmit={handleSubmit}>
                                <Input className="border-2 border-blue-400" placeholder="john doe" type="text" required name="username" value={user.username} onChange={handleChange} />
                                <Input className="border-2 border-blue-400" placeholder="******" type="password" required name="password" value={user.password} onChange={handleChange} />
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? "Sending..." : "Sign In"}
                                </Button>
                            </form>
                            <p >you aren`t have any account.?  {'  '}
                                <a href="/register" className="border-b text-blue-500 font-semibold">
                                    Sign Up

                                </a>
                            </p>
                        </>


                    )
                }
            </div>
            <img src="https://images.contentful.com/bg6mjhdcqk2h/7fidechodYAghafk7dblSz/70e0702c79524c4da91ac13b0df9f661/file_sharing.png" className="col-span-2 max-md:hidden" />
        </div>
    )
}

