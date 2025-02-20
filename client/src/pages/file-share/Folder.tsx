/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import Size from '../../components/size/Size'
import List from '../../components/files/List'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "../../components/ui/breadcrumb"
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import { addFile, deleteFolder, fetchFolders, getFolderById } from '../../redux/slicers/folderSlice'
import Loader from '../../components/sidebar/Loader'
import Error from '../../components/sidebar/Error'
import { Button } from '../../components/ui/button'
import { folder } from '../../type'
import Upload from '../../components/files/Upload'
import { RotateCcw } from 'lucide-react'
import Success from '../../components/sidebar/Success'
type Folder = {
    id: string,
    name: string,
    files: [],
    maxSize: number,
    size: number
}
const Folder = () => {
    const { id } = useParams()
    const dispatch = useDispatch<AppDispatch>()
    const folderSlice = useSelector((state: { folderSlice: { loading: boolean, folder: folder, folders: folder[], error: string, send: boolean, isDeleted: boolean } }) => state.folderSlice)
    const { loading, error, folder, folders, send, isDeleted } = folderSlice

    const [file, setFile] = useState<File | null>(null)
    const [load, setLoad] = useState(false);
    const [err, setErr] = useState<string>('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoad(true);
        setErr('');
        console.log(file);

        try {
            const file = e.target.files?.[0]
            if (e.target.files) {
                setFile(e.target.files[0]);
            }
            const formData = new FormData();

            if (file) {
                formData.append('file', file);
            }
            if (id) {
                formData.append('folderId', id.toString());
            }
            dispatch(addFile(formData))
            setLoad(false)
            setUploadProgress(100);
            setTimeout(() => setUploadProgress(0), 2000);
        } catch (error) {
            console.log(error);
            setErr('Failed to upload file');
        }

    }
    useEffect(() => {
        if (id) {
            dispatch(getFolderById(id))
            dispatch(fetchFolders())
        }
        console.log(folder);
    }, [id])
    const handleFetchFolders = () => {
        dispatch(fetchFolders())

    }
    const handleDeleFolder = () => {
        if (id) {
            dispatch(deleteFolder(id))
        }
        window.location.href = '/'
    }
    return (
        <div className="flex h-screen bg-background">
            {/* Main Content */}
            {
                loading ? <Loader /> : error ? <Error message={error} /> : (
                    <main className="flex-1 p-6">
                        {/* Header Content */}
                        <div className='grid grid-cols-3 gap-4 max-md:grid-cols-1'>
                            {/* Recent Folders */}
                            <section className="mb-8 col-span-2">
                                <Breadcrumb className='mb-4 text-3xl font-semibold'>
                                    <BreadcrumbList>
                                        <BreadcrumbItem>
                                            <BreadcrumbLink href="/" className='text-xl text-blue-700'>My Files</BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator className='text-xl' />
                                        <BreadcrumbItem>
                                            <BreadcrumbPage className='text-xl'>{folder?.name}</BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </BreadcrumbList>
                                </Breadcrumb>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className=" bg-blue-600 p-2 text-white shadow-md rounded-lg text-3xl"><span className='font-medium'>{folder?.name}</span> 📁</h2>
                                    <Button variant={'destructive'} onClick={() => handleDeleFolder()}>delete</Button>
                                </div>
                                {/*upload file */}
                                {
                                    send && <Success message={'send file success'} />
                                }
                                {
                                    isDeleted && <Success message={'delete file success'} />
                                }

                                {
                                    load || loading ? <Loader /> : err != '' || error ? <Error message={error} /> : uploadProgress > 0 ? (
                                        <div className="w-full bg-gray-200 rounded-full h-6 mb-4">
                                            <div
                                                className="bg-blue-600 h-8 font-semibold rounded-full transition-all   duration-300 text-black text-center"
                                                style={{ width: `${uploadProgress}%` }}
                                            >{uploadProgress}%</div>
                                        </div>
                                    ) : (
                                        <Upload handleFileChange={handleFileChange} />
                                    )
                                }
                                <Button className='mb-2 bg-[whitesmoke] shadow-md' variant={'outline'} onClick={() => handleFetchFolders()}>
                                    <RotateCcw />
                                    Refresh</Button>
                                {/* Recent Folders */}
                                <List folders={folders?.filter((x: any) => x._id == id)} />
                            </section>
                            {/* Storage Overview */}
                            <Size folders={folders?.filter((x: any) => x._id == id)} />
                        </div>
                    </main >
                )
            }
        </div >
    )
}
export default Folder