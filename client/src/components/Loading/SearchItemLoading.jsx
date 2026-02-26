
const SearchItemLoading = () => {
  return (
    <div className="p-2 hover:bg-gray-100 cursor-pointer">
      <div className="flex items-center">
        <div className="w-12 h-12 bg-gray-200 rounded-md animate-pulse"></div>
        <div className="ml-3">
          <h4 className="text-sm font-medium bg-gray-200 h-4 w-32 rounded animate-pulse"></h4>
          <p className="text-xs text-gray-500 bg-gray-200 h-3 w-24 rounded animate-pulse mt-1"></p>
        </div>
      </div>
    </div>
  )
}

export default SearchItemLoading