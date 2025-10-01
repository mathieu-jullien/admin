import { decodeToken } from '../../utils/token';

export default function Home() {
  console.log(decodeToken());
  return <h1>Homepage</h1>;
}
