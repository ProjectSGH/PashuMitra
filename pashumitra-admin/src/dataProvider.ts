import { DataProvider } from "react-admin";

const apiUrl = "http://localhost:5000/api"; // ✅ only /api (not /api/users)

const dataProvider: DataProvider = {
  getList: async (resource, params) => {
    const response = await fetch(`${apiUrl}/${resource}`);
    if (!response.ok) throw new Error(`Error ${response.status}`);
    const json = await response.json();

    return {
      data: json.map((item: any) => ({
        ...item,
        id: item._id, // map MongoDB _id to id
      })),
      total: json.length,
    };
  },

  getOne: async (resource, params) => {
    const res = await fetch(`${apiUrl}/${resource}/${params.id}`);
    if (!res.ok) throw new Error(`Error ${res.status}`);
    const data = await res.json();
    return { data: { ...data, id: data._id } };
  },

  update: async (resource, params) => {
  let url = `${apiUrl}/${resource}/${params.id}`;
  if (resource === "notifications") {
    url = `${apiUrl}/notifications/${params.id}/read`;
  }

  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params.data),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  const data = await res.json();
  return { data: { ...data, id: data._id } };
},

create: async (resource, params) => {
  let url = `${apiUrl}/${resource}`;
  
  if (resource === "notifications/send") {
    url = `${apiUrl}/notifications/send`;
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params.data),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  const data = await res.json();
  return { data: { ...data, id: data._id || "" } };
},


  delete: async (resource, params) => {
    const res = await fetch(`${apiUrl}/${resource}/${params.id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    const data = await res.json();
    return { data: { ...data, id: data._id } };
  },

  getMany: async (resource, params) => {
    const responses = await Promise.all(
      params.ids.map((id) =>
        fetch(`${apiUrl}/${resource}/${id}`).then((res) => res.json())
      )
    );
    return { data: responses.map((d) => ({ ...d, id: d._id })) };
  },

  getManyReference: () => Promise.resolve({ data: [], total: 0 }),
};

export default dataProvider;
