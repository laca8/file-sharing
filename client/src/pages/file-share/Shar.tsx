/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { Card } from "../../components/ui/card"
import { useNavigate } from 'react-router-dom'
import Size from '../../components/size/Size'
import FolderForm from './Form'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import { fetchFolders } from '../../redux/slicers/folderSlice'
import Loader from '../../components/sidebar/Loader'
import Error from '../../components/sidebar/Error'
import { Button } from '../../components/ui/button'
import { RotateCcw } from 'lucide-react'
type Folder = {
  maxSize: number,
  size: number,
  id: string,
  name: string,
  files: []
}
const Shar = () => {
  const dispatch = useDispatch<AppDispatch>()
  const folderSlice = useSelector((state: { folderSlice: { loading: boolean, folders: any[], error: string, success: boolean } }) => state.folderSlice)
  const { loading, error, folders } = folderSlice

  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [newFolder, setNewFolder] = useState<Folder>({
    name: '',
    files: [],
    maxSize: Number(100) / Number(folders.length),
    size: Number(0),
    id: `${Date.now()}`
  })
  const navigator = useNavigate()
  useEffect(() => {
    dispatch(fetchFolders())
  }, [])
  const handleFetchFolders = () => {
    dispatch(fetchFolders())

  }
  return (
    <div className=" h-screen bg-[whitesmoke] p-6 ">


      {/*create folder*/}
      <FolderForm setNewFolder={setNewFolder} newFolder={newFolder} open={isNewTaskOpen} onOpenChange={setIsNewTaskOpen} />
      {/* Main Content */}
      {
        loading ? <Loader /> : error ? <Error message={error} /> : (
          <main className="w-full grid grid-cols-3 gap-6 mt-4 max-md:grid-cols-1">
            {/* Recent Folders */}
            <section className="mb-8 col-span-2">


              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Recent Folders</h2>
                <Button className='mb-2 bg-[whitesmoke] shadow-md' variant={'outline'} onClick={() => handleFetchFolders()}>
                  <RotateCcw />
                  Refresh</Button>
              </div>
              <div className="grid grid-cols-4 gap-4 max-md:grid-cols-2 max-sm:grid-cols-1">
                {folders?.map((folder) => (
                  <div className='relative'>
                    <button className='bg-blue-500 rounded-full absolute bottom-3/4 right-0  shadow-md px-3 py-0.5 mt-2  text-md font-semibold  text-white'>{folder?.files?.length}</button>
                    <Card key={folder._id} className="p-4 cursor-pointer hover:bg-accent " onClick={() => navigator(`/share/${folder._id}`)}>
                      <div className="flex items-center gap-2 text-2xl ">
                        <div className="text-yellow-500 text-3xl">📁</div>
                        <span className='text-3xl'>{folder.name}</span>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </section>
            {/* Storage Overview */}
            <div className='col-span-1'>
              <Size folders={folders} />
            </div>
          </main>
        )
      }
    </div>
  )
}
export default Shar