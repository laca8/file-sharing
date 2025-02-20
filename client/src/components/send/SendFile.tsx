/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

import { Button } from "../ui/button";
import { Share2Icon, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { folder } from "../../type";
import Error from "../sidebar/Error";
import Loader from "../sidebar/Loader";
import { sendFile } from "../../redux/slicers/folderSlice";
import { fetchUsers } from "../../redux/slicers/userSlice";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Card } from "../ui/card";
import { Textarea } from "../ui/textarea";
type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    fileId: string,
    folderId: string

}
const FolderForm = ({ open, onOpenChange, fileId, folderId }: Props) => {
    const [selectedUser, setSelectedUser] = useState('');

    const selectUser = (userId: string) => {
        setSelectedUser(userId);
    };
    const [comment, setComment] = useState('');

    const dispatch = useDispatch<AppDispatch>()
    const userInfo = JSON.parse(localStorage.getItem("user") || "null");
    const folderSlice = useSelector((state: { folderSlice: { loading: boolean, file: any, folder: folder, folders: folder[], error: string, success: boolean } }) => state.folderSlice)
    const { loading, error } = folderSlice
    const userSlice = useSelector((state: { userSlice: { loading: boolean, users: any[], error: string, success: boolean } }) => state.userSlice)
    const { loading: loaUsers, error: errUsers, users } = userSlice
    // const [newSend, setNewSend] = useState<any>({
    //     username: '',
    //     fileId,
    //     folderId
    // })
    // const handleChange = (name: string, value: string) => {
    //     setNewSend({
    //         ...newSend,
    //         [name]: value
    //     })
    // }
    const handleSubmit = (username: string, comment: string) => {
        const newSend = {
            username,
            comment,
            fileId,
            folderId
        }
        console.log(newSend);


        dispatch(sendFile(newSend))

    }
    useEffect(() => {
        dispatch(fetchUsers())
    }, [])
    return (
        <div className=''>
            <Button onClick={() => onOpenChange(!open)} className="w-full justify-start gap-2" >
                <Share2Icon className="h-12 w-12" />
            </Button>

            {
                error && <Error message={error} />
            }
            {
                loading ? <Loader /> : (
                    <Dialog open={open} onOpenChange={onOpenChange}>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className='text-center text-6xl flex items-center mx-auto'>
                                    <Users className='w-16 h-16 text-blue-600 ' />
                                </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <Card className=" border-2 rounded-md shadow-md max-h-96 overflow-y-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead >Avatar</TableHead>
                                                <TableHead>Name</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {
                                                loaUsers ? <Loader /> : errUsers ? <Error message={errUsers} /> : (
                                                    users?.filter((x) => x?.username != userInfo?.createdUser?.username)?.map((x, i) => (
                                                        <TableRow
                                                            className={`cursor-pointer border-b hover:bg-slate-100 transition-colors
                                                            ${selectedUser === x.username ? 'bg-blue-300' : ''}`}
                                                            onClick={() => selectUser(x.username)}
                                                            key={i} >
                                                            <TableCell>
                                                                <Avatar>
                                                                    <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
                                                                    <AvatarFallback>{x.username[0]}</AvatarFallback>
                                                                </Avatar>
                                                            </TableCell>
                                                            <TableCell>
                                                                {x.username}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                )
                                            }
                                        </TableBody>
                                    </Table>


                                </Card>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Comment</label>
                                    <Textarea
                                        placeholder="Write your comment here..."
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="min-h-[100px]"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={!selectedUser || !comment}
                                    onClick={() => handleSubmit(selectedUser, comment)}
                                >
                                    Send
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                )
            }

        </div>
    );
};

export default FolderForm;