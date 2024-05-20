import { useState } from 'react';
import './App.css';
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query"
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';


function CustomerTable() {
  const [page, setPage] = useState(1);

  const { data: custData, isLoading, refetch } = useQuery({
    //dependancy array which automaticallly resend the request on varable change
    queryKey: ["custData", page],
    //query function which runs on page lloads, onWindowfocus,etc.
    queryFn: () => axios.get(`http://localhost:4000/api/getAll?page=${page}`).then(res => res.data)
  })

  // function to change status 
  const onClickChangeStatus = (id) => {
    // sending put request to backend server with body containing id
    axios.put("http://localhost:4000/api/changeStatus", { id })
      //handing if we do not get any error
      .then(res => {
        if (res.data.success) {
          toast.success("Status changed!");
          refetch();
        } else {
          toast.error(res.data?.message)
        }
      })
      // handling errors if any
      .catch(err => {
        toast.error(err?.request?.body?.message || err?.message || "Error occured! Try again later!")
      })
  }

  //next page function which increase the page number when it is less than total pages
  const onClickNext = () => {
    if (!isLoading && page < custData?.totalPages) {
      setPage(page + 1)
    }
  }
  //similarly it is for previous page numbers till one
  const onClickPrevious = () => {
    if (page > 1) {
      setPage(page - 1)
    }
  }
  return (
    <div className="text-gray-900 bg-gray-200">
      <div className="p-4 flex">
        <h1 className="text-3xl">Customers</h1>
      </div>
      <div className="px-3 py-4 flex justify-center">
        <table className="w-full text-md bg-white shadow-md rounded mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-4 px-6  text-gray-600 font-bold uppercase">Name</th>
              <th className="py-4 px-6  text-gray-600 font-bold uppercase">Type</th>
              <th className="py-4 px-6  text-gray-600 font-bold uppercase">Status</th>
              <th className="py-4 px-6  text-gray-600 font-bold uppercase">Action</th>
            </tr>
          </thead>
          <tbody>
            {!isLoading && custData?.customers.map((cust, idx) => (
              <tr key={idx}>
                <td className="py-4 px-6 border-b border-gray-200">{cust?.custName}</td>
                <td className="py-4 px-6 border-b border-gray-200 truncate">{cust?.custType}</td>
                <td className="py-4 px-6 border-b border-gray-200">
                  <span className={`${cust?.custStatus ? "bg-green-500" : "bg-red-500"} text-white py-1 px-2 rounded-full text-xs`}>{cust?.custStatus ? "Active" : "Inactive"}</span>
                </td>
                <td className="py-4 px-6 border-b border-gray-200 flex justify-center">
                  <button type="button"
                    onClick={() => onClickChangeStatus(cust?.custId)}
                    className="text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">Change Status</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <nav className="inline-flex items-center p-1 rounded bg-white space-x-2">
        <div onClick={onClickPrevious} className="p-1 rounded border text-black bg-white hover:text-white hover:bg-blue-600 hover:border-blue-600" >
          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd"
              d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
          </svg>
        </div>
        <p className="text-gray-500">Page {" " + page + " "} of {!isLoading && " " + custData?.totalPages + " "}</p>
        <div onClick={onClickNext} className="p-1 rounded border text-black bg-white hover:text-white hover:bg-blue-600 hover:border-blue-600" href="#">
          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd"
              d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
          </svg>
        </div>
      </nav>
    </div>
  )
}


function App() {
  //creating object of query client here we can customize behaviour of query
  const query = new QueryClient();

  return (
    // this is a query client provider because of this we can use Query seemlessly throughout all application/ components under this provider 
    <QueryClientProvider client={query}>
      {/* toaster helps to render toasts */}
      <Toaster />
      <div className="App">
        {/* custom component CustomerTable */}
        <CustomerTable />
      </div>
    </QueryClientProvider>
  );
}

export default App;
