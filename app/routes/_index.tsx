import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";


export const loader: LoaderFunction = async () => {
  
  const data = await fetch(process.env.API_URL + "/api/Users");
  if (!data.ok) {
    throw new Response("Failed to fetch data", { status: 500 });
  }
  const users = await data.json();
  console.log(users);
  return json(users);
};


export default function Index() {
  const users: any = useLoaderData();
  console.log(users);
  return (
    <>
      <h1>Lista de usuarios</h1>
      <ul>
        {users.map((user: any) => (
          <li key={user.id}>
            <h2>{user.name}</h2>
            <p>Correo: {user.email}</p>
          </li>
        ))}
      </ul>
    </>
  );
}