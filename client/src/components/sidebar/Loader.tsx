import { Skeleton } from "../ui/skeleton"

function Loader() {
    return (
        <div className="flex items-center space-x-4  shadow-md mx-auto p-4 mt-10">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
    )
}
export default Loader