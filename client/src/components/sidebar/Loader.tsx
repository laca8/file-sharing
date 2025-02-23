import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"
import { Skeleton } from "../ui/skeleton"

const SkeletonLoader = () => {
    return (
        <div className="w-full max-w-6xl mx-auto p-4 space-y-4">
            {/* Hero Section Skeleton */}
            <div className="w-full h-48 md:h-64 mb-8">
                <Skeleton className="w-full h-full rounded-lg" />
            </div>
            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((item) => (
                    <Card key={item} className="overflow-hidden">
                        <CardHeader className="space-y-2">
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-4 w-1/2" />
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Skeleton className="h-32 w-full rounded-md" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                                <Skeleton className="h-4 w-4/6" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Skeleton className="h-9 w-24" />
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Sidebar Section */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-grow space-y-4">
                    <Skeleton className="h-8 w-3/4" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                </div>
                <div className="lg:w-72 space-y-4">
                    <Skeleton className="h-40 w-full rounded-lg" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>
                </div>
            </div>

            {/* List Section */}
            <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SkeletonLoader;