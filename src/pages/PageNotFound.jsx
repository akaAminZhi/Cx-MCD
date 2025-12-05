import { useMoveBack } from "../hooks/useMoveBack";
function PageNotFound() {
  const moveBack = useMoveBack();
  return (
    <div className="p-2">
      <div className="text-2xl text-gray-600 flex items-center justify-center h-screen">
        <p>oups,page not found.🤣</p>
        <button onClick={moveBack}>&larr; Go back</button>
      </div>
    </div>
  );
}

export default PageNotFound;
