import { useParams, useLocation } from
'react-router-dom';
export default function Edit() {
  const { id } = useParams();
  const location = useLocation();
  console.log(location);
  return (
    <div>
      <h1>Modification Experiences</h1>
      <p>id: {id}</p>
      <p>location : {location.pathname}</p>
    </div>
  );
}
