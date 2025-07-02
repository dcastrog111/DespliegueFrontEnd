import { json, LoaderFunction, ActionFunction } from "@remix-run/node";
import { Form, redirect, useLoaderData, useNavigation } from "@remix-run/react";


export const loader: LoaderFunction = async () => {
  
  const data = await fetch(process.env.API_URL + "/api/Users");
  if (!data.ok) {
    throw new Response("Failed to fetch data", { status: 500 });
  }
  const users = await data.json();
  console.log(users);
  return json(users);
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  
  const newUser = {
    name: formData.get("name"),
    email: formData.get("email")
  };

  try {
    const response = await fetch(process.env.API_URL + "/api/Users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    if (!response.ok) {
      throw new Response("Failed to create user", { status: 500 });
    }

    return redirect("/");
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Response("Failed to create user", { status: 500 });
  }
};


export default function Index() {
  const users: any = useLoaderData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Lista de usuarios</h1>
      
      {/* Formulario para agregar nuevos usuarios */}
      <div style={{ marginBottom: "30px", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
        <h2>Agregar nuevo usuario</h2>
        <Form method="post" style={{ display: "flex", flexDirection: "column", gap: "15px", maxWidth: "400px" }}>
          <div>
            <label htmlFor="name" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Nombre:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              style={{ 
                width: "100%", 
                padding: "8px", 
                border: "1px solid #ccc", 
                borderRadius: "4px",
                fontSize: "16px"
              }}
              placeholder="Ingresa el nombre"
            />
          </div>
          
          <div>
            <label htmlFor="email" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              style={{ 
                width: "100%", 
                padding: "8px", 
                border: "1px solid #ccc", 
                borderRadius: "4px",
                fontSize: "16px"
              }}
              placeholder="Ingresa el email"
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: "10px 20px",
              backgroundColor: isSubmitting ? "#ccc" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              transition: "background-color 0.3s"
            }}
          >
            {isSubmitting ? "Agregando..." : "Agregar Usuario"}
          </button>
        </Form>
      </div>

      {/* Lista de usuarios */}
      <div>
        <h2>Usuarios registrados ({users.length})</h2>
        {users.length === 0 ? (
          <p style={{ color: "#666", fontStyle: "italic" }}>No hay usuarios registrados</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {users.map((user: any) => (
              <li 
                key={user.id} 
                style={{ 
                  marginBottom: "15px", 
                  padding: "15px", 
                  border: "1px solid #ddd", 
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9"
                }}
              >
                <h3 style={{ margin: "0 0 8px 0", color: "#333" }}>{user.name}</h3>
                <p style={{ margin: 0, color: "#666" }}>📧 {user.email}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}