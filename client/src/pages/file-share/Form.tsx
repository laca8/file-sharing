/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { FolderPlus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { folder } from "../../type";
import { addFolder, fetchFolders } from "../../redux/slicers/folderSlice";
import Loader from "../../components/sidebar/Loader";
import Error from "../../components/sidebar/Error";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    newFolder: {
        name: string,
        maxSize: number,
        files: [],
        id: string;
        size: number;

    },
    setNewFolder: (newFolder: {
        name: string,
        maxSize: number,
        size: number;
        files: [],
        id: string
    }) => void;


}
const FolderForm = ({ open, onOpenChange, setNewFolder, newFolder }: Props) => {
    const dispatch = useDispatch<AppDispatch>()
    const folderSlice = useSelector((state: { folderSlice: { loading: boolean, folders: folder[], error: string, success: boolean } }) => state.folderSlice)
    const { loading, error, success } = folderSlice
    const handleChange = (name: string, value: string) => {
        setNewFolder({
            ...newFolder,
            [name]: value
        })
    }
    const handleSubmit = () => {
        console.log(newFolder)
        dispatch(addFolder(newFolder))
        dispatch(fetchFolders())
        if (success) {
            onOpenChange(!open)
        }
    }
    return (
        <div className=''>
            <Button onClick={() => onOpenChange(!open)} className=" justify-start gap-2 shadow-md">
                <FolderPlus className="h-4 w-4" />
                Create Folder
            </Button>
            {
                loading ? <Loader /> : error ? <Error message={error} /> : (
                    <Dialog open={open} onOpenChange={onOpenChange}>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className='text-center text-6xl'>📁</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">

                                <div>
                                    <label htmlFor="requester-name">Folder Name</label>
                                    <Input
                                        id="name"
                                        placeholder="Type here ..."
                                        className="mt-1.5"
                                        name='name'
                                        onChange={(e) => handleChange('name', e.target.value)}

                                    />
                                </div>

                                <Button className="w-full" onClick={() => handleSubmit()}>New Folder</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                )
            }
        </div>
    );
};

export default FolderForm;