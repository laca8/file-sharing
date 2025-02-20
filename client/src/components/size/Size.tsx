/* eslint-disable @typescript-eslint/no-explicit-any */
import { FileText, Image } from 'lucide-react'
import { Card } from '../ui/card'
type Props = {
    folders: any[]
}
const Size = ({ folders }: Props) => {
    console.log(folders);
    const calculateSize = (field: string) => {
        let totalSize = 0;

        folders.forEach(category => {
            category.files.forEach((file: { type: string; size: number }) => {
                if (file.type.includes(field)) {
                    totalSize += file.size;
                }
            });
        });

        return totalSize;
    };
    const calculateCount = (field: string) => {
        let totalCount = 0;
        folders.forEach(category => {
            category.files.forEach((file: File) => {
                if (file.type.includes(field)) {
                    totalCount += 1;
                }
            });
        });
        return totalCount;
    };

    return (
        <div>
            <Card className="p-4">
                <div className="flex flex-col  mb-2">
                    <h3 className="font-medium mb-1">Storage Overview</h3>
                    <p className="text-sm text-muted-foreground font-semibold">
                        <span className='text-blue-600 font-bold '>
                            {(folders?.map((z: any) =>
                                z.files.reduce((acc: number, val: any) => acc + val.size, 0)).reduce((acc: number, val: number) => acc + val, 0) / Math.pow(1024, 2)).toFixed(2)}
                        </span>
                        {' '}MB
                        {/* of <span className='text-blue-600 font-bold'>10</span> */}

                        {' '}</p>
                </div>

                {/* <progress value={(folders?.map((z: any) =>
                    z.files.reduce((acc: number, val: any) => acc + val.size, 0)).reduce((acc: number, val: number) => acc + val, 0) / Math.pow(1024, 2)).toFixed(2)}
                    max="10" className='mb-2' /> */}
                <div className="grid grid-cols-1 gap-4">

                    <div className='flex flex-col gap-2' >
                        <Card className="p-4 flex items-center justify-between gap-2">
                            <div className='flex gap-4 items-center'>
                                {/* {item.icon == 'Image' ? <Image className={`w-10 h-10 p-2 text-green-600 rounded ${item.color} `} /> : item.icon == 'Youtube' ? <Youtube className={`w-10 h-10 p-2 text-blue-600 rounded ${item.color} `} /> : item.icon == 'FileText' ? <FileText className={` p-2 w-10 text-yellow-600 h-10 rounded ${item.color} `} /> : <ShieldAlert className={`text-red-600 p-2 w-10 h-10 rounded ${item.color} `} />

                                } */}
                                <Image className={`w-10 h-10 p-2 text-green-600 rounded  `} />

                                <div>
                                    <h4 className="text-sm font-semibold">{'images'}</h4>
                                    <p className="text-sm text-muted-foreground">{calculateCount('image')} files</p>
                                </div>
                            </div>

                            <p className="text-sm font-medium">{(calculateSize('image') / Math.pow(1024, 2)).toFixed(2)

                            }{' '}MB</p>
                        </Card>
                        <Card className="p-4 flex items-center justify-between gap-2">
                            <div className='flex gap-4 items-center'>
                                {/* {item.icon == 'Image' ? <Image className={`w-10 h-10 p-2 text-green-600 rounded ${item.color} `} /> : item.icon == 'Youtube' ? <Youtube className={`w-10 h-10 p-2 text-blue-600 rounded ${item.color} `} /> : item.icon == 'FileText' ? <FileText className={` p-2 w-10 text-yellow-600 h-10 rounded ${item.color} `} /> : <ShieldAlert className={`text-red-600 p-2 w-10 h-10 rounded ${item.color} `} />

                                } */}
                                <FileText className={`w-10 h-10 p-2 text-yellow-600 rounded  `} />

                                <div>
                                    <h4 className="text-sm font-semibold">{'files'}</h4>
                                    <p className="text-sm text-muted-foreground">{calculateCount('application') + calculateCount('text')} files</p>
                                </div>
                            </div>

                            <p className="text-sm font-medium">{((calculateSize('application') + calculateSize('text')) / Math.pow(1024, 2)).toFixed(2)

                            } {' '}MB</p>
                        </Card>




                    </div>

                </div>
            </Card>
        </div>
    )
}

export default Size