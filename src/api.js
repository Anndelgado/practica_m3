const API_URL = "http://localhost:3000/tasks";

export async function getTasks() {

  const response = await fetch(API_URL);

  return await response.json();
}

export async function createTask(task) {

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(task)
  });

  return await response.json();
}

export async function updateTask(id, updatedTask) {

  await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updatedTask)
  });

}

export async function deleteTask(id) {

  await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });

}