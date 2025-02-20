import { Card } from '../ui/card'
import { FileIcon } from 'lucide-react'
import { Input } from '../ui/input'

type Props = {
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Upload = ({ handleFileChange }: Props) => {
    return (
        <Card className='p-2 flex flex-col items-center gap-4 mb-4'>
            <label htmlFor="file" className="text-sm font-medium flex flex-col items-center gap-2">
                <FileIcon className="w-12 h-12" />
                <Input id="file" type="file" placeholder="File" accept="/*" className='hidden' onChange={handleFileChange} />
                <span className="text-sm font-medium text-gray-500">Drag and drop a file or click to browse</span>
                <span className="text-xs text-gray-500">PDF, image, video, or audio</span>
            </label>

        </Card>
    )
}

export default Upload