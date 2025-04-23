import RequestCard from "./RequestCard"

const RequestList = ({ requests }) => {
  return (
    <div>
      {requests.map((request, index) => (
        <RequestCard key={index} request={request} />
      ))}
    </div>
  )
}

export default RequestList
