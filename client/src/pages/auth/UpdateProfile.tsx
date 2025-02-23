import React, { useEffect } from 'react'
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Loader2 } from "lucide-react"
import Error from '../../components/sidebar/Error'
import Loader from '../../components/sidebar/Loader'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import { updatePassword } from '../../redux/slicers/userSlice'
import { user } from '../../type'
import Success from '../../components/sidebar/Success'
const ChangePasswordForm = () => {
    const dispatch = useDispatch<AppDispatch>()
    const userInfo = JSON.parse(localStorage.getItem("user") || "null");
    const userSlice = useSelector((state: { userSlice: { loading: boolean, user: user, error: string, update: boolean } }) => state.userSlice)
    const { loading, error, update } = userSlice
    const [formData, setFormData] = React.useState(
        {
            password: '',
            confirmPassword: '',
            id: ''
        })
    const [msg, setMsg] = React.useState('')

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
        setMsg('')
    }

    const validatePasswords = () => {
        if (formData.password !== formData.confirmPassword) {
            setMsg("New passwords don't match")
            return false
        }


    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (validatePasswords()) return
        formData.id = userInfo.createdUser._id
        // Simulate API call
        dispatch(updatePassword(formData))
        console.log(formData);


        // Reset form after successful submission
        setFormData({
            password: '',
            confirmPassword: '',
            id: ''
        })

    }
    useEffect(() => {
        if (update) {
            localStorage.removeItem('user')
            window.location.href = '/login'
        }

    }, [update])
    return (
        <Card className="max-w-md mx-auto mt-16">
            <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                    Update your password to keep your account secure
                </CardDescription>
            </CardHeader>
            {
                update && <Success message={'change password success'} />
            }
            {
                error && <Error message={error} />
            }
            {
                msg != '' && <Error message={msg} />
            }
            {
                loading ? <Loader /> : (
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">


                            <div className="space-y-2">
                                <label htmlFor="password">New Password</label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => handleChange('password', e.target.value)}

                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="confirmPassword">Confirm New Password</label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                    required
                                />
                            </div>

                        </CardContent>

                        <CardFooter className="flex justify-end space-x-2">

                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Update Password
                            </Button>
                        </CardFooter>
                    </form>
                )
            }
        </Card>
    )
}

export default ChangePasswordForm