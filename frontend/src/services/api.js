// Dirección del backend. En local usa localhost:8000; en producción se define VITE_API_URL al construir.
export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export const getProducts = async () => {
  const response = await fetch(`${API_URL}/products/`);
  return await response.json();
};

export const getServices = async () => {
  const response = await fetch(`${API_URL}/services/`);
  return await response.json();
};

export const createPet = async (petData) => {
  const response = await fetch(`${API_URL}/pets/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: petData.name,
      species: petData.species,
      breed: petData.breed,
      age: parseInt(petData.age),
      weight: parseFloat(petData.weight),
      notes: petData.notes,
      owner_id: petData.ownerId,
    }),
  });
  return await response.json();
};
