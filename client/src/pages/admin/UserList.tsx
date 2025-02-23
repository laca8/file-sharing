/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store";

import Error from "../../components/sidebar/Error";
import Loader from "../../components/sidebar/Loader";

import { deleteUser, fetchUsers } from "../../redux/slicers/userSlice";
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Card } from "../../components/ui/card";
import { DeleteIcon } from "lucide-react";
import { Button } from "../../components/ui/button";


const UserList = () => {
    const dispatch = useDispatch<AppDispatch>()
    const userSlice = useSelector((state: { userSlice: { loading: boolean, users: any[], error: string, success: boolean } }) => state.userSlice)
    const { loading, error, users } = userSlice
    useEffect(() => {
        dispatch(fetchUsers())
    }, [])
    const handleDeleteUser = (id: string) => {
        console.log(id)
        if (window.confirm("Are you sure you want to delete this user?")) {
            dispatch(deleteUser(id))

        }
    }
    return (
        <div className="max-w-5xl mx-auto p-8">
            {
                error && <Error message={error} />
            }
            {
                loading ? <Loader /> : (

                    <div className="space-y-4">
                        <Card className=" border-2 rounded-md shadow-md max-h-96 overflow-y-auto text-xl font-medium">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead >i</TableHead>
                                        <TableHead >Avatar</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>#</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {

                                        users?.map((x, i) => (
                                            <TableRow
                                                className={`cursor-pointer border-b  `}

                                                key={i} >
                                                <TableCell>
                                                    {i + 1}
                                                </TableCell>
                                                <TableCell>

                                                    <Avatar>
                                                        <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
                                                        <AvatarFallback>{x.username[0]}</AvatarFallback>
                                                    </Avatar>
                                                </TableCell>
                                                <TableCell>
                                                    {x.username}
                                                </TableCell>
                                                <TableCell>
                                                    <Button onClick={() => handleDeleteUser(x._id)} className="bg-red-500  hover:bg-red-600 text-white rounded-md p-2">
                                                        <DeleteIcon size={24} /> Delete
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))


                                    }
                                </TableBody>
                            </Table>


                        </Card>
                    </div>
                )}
        </div>
    )
}

export default UserList