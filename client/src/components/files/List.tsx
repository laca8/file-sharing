/* eslint-disable @typescript-eslint/no-explicit-any */

import { Card } from '../ui/card'
import { Download, EllipsisVertical, FileText, Image, ShieldAlert, Trash, Youtube } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { useState } from 'react'
import SendFile from '../send/SendFile'
import { Button } from '../ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import { folder } from '../../type'
import { deleteFile, fetchFolders } from '../../redux/slicers/folderSlice'
import Error from '../sidebar/Error'
import Loader from '../sidebar/Loader'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../ui/tooltip"
type Props = {
    folders: any[]
}

const List = ({ folders }: Props) => {
    const dispatch = useDispatch<AppDispatch>()
    const folderSlice = useSelector((state: { folderSlice: { loading: boolean, folder: folder, folders: folder[], error: string, success: boolean } }) => state.folderSlice)
    const { loading, error } = folderSlice
    const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);


    const handleDelete = (folderId: string, id: string) => {
        const row = { folderId, id: id.toString() }
        console.log(row);
        dispatch(deleteFile(row))
        dispatch(fetchFolders())
    }
    const handleDownload = (name: string, url: string) => {
        console.log(url);
        try {
            // Create temporary link and trigger download
            const link = document.createElement('a');
            link.href = url;
            link.download = name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            // dispatch(downloadFile({ url }))
        } catch (err) {
            console.log(err);
        }
    }
    const formatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    return (
        <Card>
            {
                error && <Error message={error} />
            }
            {
                loading ? <Loader /> : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead >Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Size</TableHead>
                                <TableHead>Date</TableHead>
                                {
                                    folders.map((x) => x.name == 'Received' && <TableHead>Comment</TableHead>)
                                }

                                <TableHead>#</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                folders?.map((z: any) =>
                                    z.files.map((y: any, i: string) => (
                                        <TableRow key={i}>
                                            <TableCell className='line-clamp-2'>{y.name.length > 50 ? y.name.slice(0, 30) : y.name}</TableCell>
                                            <TableCell className='w-20'>{y?.type?.includes('image') ? <Image className={`w-10 h-10 p-2 text-green-600 rounded bg-green-100 `} /> : y?.type?.includes('text') || y?.type?.includes('application') ? <FileText className={`w-10 h-10 p-2 text-yellow-600 rounded bg-yellow-100 `} /> : y?.type?.includes('video') ? <Youtube className={`w-10 h-10 p-2 text-blue-600 rounded bg-blue-100 `} /> : <ShieldAlert className={`text-red-600 p-2 w-10 h-10 rounded bg-red-100 `} />}</TableCell>
                                            <TableCell className='w-20'>{(y?.size / Math.pow(1024, 2)).toFixed(2)} MB</TableCell>
                                            <TableCell className='w-56'>{y?.createdAt ? formatter.format(new Date(y?.createdAt)) : ''}</TableCell>
                                            {
                                                z.name == 'Received' && <TableCell>
                                                    <TooltipProvider >
                                                        <Tooltip >
                                                            <TooltipTrigger className='bg-blue-50 text-black shadow-md rounded-md  p-2'>Show Comment</TooltipTrigger>
                                                            <TooltipContent className='w-56'>
                                                                <p>{y?.comment}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </TableCell>

                                            }
                                            <TableCell className='w-12'>
                                                <DropdownMenu >
                                                    <DropdownMenuTrigger>
                                                        <EllipsisVertical />
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent className="  bg-zinc-600 flex flex-col items-center mx-auto shadow-xl rounded-lg">
                                                        <SendFile open={isNewTaskOpen} onOpenChange={setIsNewTaskOpen} fileId={y.publicId} folderId={z._id} />
                                                        <hr className='w-full border-2 border-gray-300' />
                                                        <Button className="w-full justify-start gap-2 bg-green-600 hover:bg-green-500" onClick={() => handleDownload(y.name, y.url)}>
                                                            <Download className=" h-12 w-12 " />
                                                        </Button>
                                                        <hr className='w-full border-2 border-gray-300' />
                                                        <Button variant="destructive" className="w-full justify-start gap-2" onClick={() => handleDelete(z._id, y.publicId)} >
                                                            <Trash className=" h-12 w-12 tfont-bold " />
                                                        </Button>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )
                            }
                        </TableBody>
                    </Table>
                )
            }
        </Card>
    )
}

export default List