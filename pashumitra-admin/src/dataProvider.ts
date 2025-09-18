import { DataProvider } from "react-admin";

const apiUrl = "http://localhost:5000/api";

// 🔹 Helper to safely extract an ID
const getId = (id: any): string | null => {
  if (!id) return null;
  if (typeof id === "string") return id;
  if (typeof id === "object") return id.id || id._id || String(id);
  return String(id);
};

// 🔹 Normalize response data so RA always has a proper "id"
// dataProvider.ts - Add farmer/varify support
const normalizeData = (data: any, fallbackId: any = null, resource?: string) => {
  if (resource === "doctor/varify") {
    return {
      ...data,
      id: data._id || data.id || fallbackId,
      doctorId: data.doctorId,
      doctorProfile: {
        name: data.doctorId?.fullName || "",
        specialization: data.doctorId?.specialization || "",
        hospitalName: data.doctorId?.hospitalname || "",
      },
    };
  }

  if (resource === "farmer/varify") {
    return {
      ...data,
      id: data._id || data.id || fallbackId,
      farmerId: data.farmerId,
      farmerProfile: {
        fullName: data.farmerId?.fullName || "",
        village: data.farmerId?.village || "",
        city: data.farmerId?.city || "",
        state: data.farmerId?.state || "",
      },
    };
  }

  return { ...data, id: data._id || data.id || fallbackId };
};

const dataProvider: DataProvider = {
  // 📌 Get List
  getList: async (resource, params) => {
    let url = `${apiUrl}/${resource}`;

    if (resource === "doctor/varify") {
      url = `${apiUrl}/doctor/varify`;
    } else if (resource === "farmer/varify") {
      url = `${apiUrl}/farmer/varify`;
    } else if (resource === "users") {
      url = `${apiUrl}/users`;
    } else if (resource === "s" || resource === "doctors") {
      return { data: [], total: 0 };
    }

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const json = await res.json();

      const dataArray = Array.isArray(json) ? json : [json];

      return {
        data: dataArray.map((item: any) => normalizeData(item, null, resource)),
        total: dataArray.length,
      };
    } catch (error) {
      if (resource === "s" || resource === "doctors") {
        return { data: [], total: 0 };
      }
      throw error;
    }
  },

  // 📌 Get One
  getOne: async (resource, params) => {
    const id = getId(params.id);
    
    if (resource === "doctor/varify") {
      try {
        const res = await fetch(`${apiUrl}/doctor/varify`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const verifications = await res.json();
        
        const verification = verifications.find((v: any) => 
          v._id === id || v.id === id || v.doctorId?._id === id
        );
        
        if (!verification) throw new Error("Verification not found");
        return { data: normalizeData(verification, id, resource) };
      } catch (error) {
        console.error("Error fetching verification:", error);
        throw error;
      }
    }

    if (resource === "farmer/varify") {
      try {
        const res = await fetch(`${apiUrl}/farmer/varify`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const verifications = await res.json();
        
        const verification = verifications.find((v: any) => 
          v._id === id || v.id === id || v.farmerId?._id === id
        );
        
        if (!verification) throw new Error("Verification not found");
        return { data: normalizeData(verification, id, resource) };
      } catch (error) {
        console.error("Error fetching farmer verification:", error);
        throw error;
      }
    }

    if (resource === "s" || resource === "doctors") {
      return { data: { id, dummy: true } };
    }

    const url = `${apiUrl}/${resource}/${id}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Error ${res.status}`);
    const data = await res.json();
    
    return { data: normalizeData(data, id, resource) };
  },

  // 📌 Update
  update: async (resource, params) => {
    const id = getId(params.id);
    
    if (resource === "s" || resource === "doctors") {
      return { data: { id, ...params.data } };
    }

    let url = `${apiUrl}/${resource}/${id}`;
    let method = "PATCH";
    let bodyData = params.data;

    if (resource === "notifications") {
      url = `${apiUrl}/notifications/${id}/read`;
    }

    if (resource === "doctor/varify") {
      url = `${apiUrl}/doctor/varify/verify-by-id/${id}`;
      bodyData = { action: params.data.action };
    }

    if (resource === "farmer/varify") {
      // For farmer verification, we need to use the approve endpoint
      url = `${apiUrl}/farmer/varify/approve/${id}`;
      method = "PUT";
      bodyData = {}; // No body needed for your current farmer approve endpoint
    }

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: Object.keys(bodyData).length > 0 ? JSON.stringify(bodyData) : undefined,
    });
    
    if (!res.ok) throw new Error(`Error ${res.status}`);
    const data = await res.json();
    return { data: normalizeData(data, id, resource) };
  },
  
  // 📌 Delete
  delete: async (resource, params) => {
    const id = getId(params.id);
    
    // Handle non-existent resources
    if (resource === "s" || resource === "doctors") {
      return { data: { id } };
    }

    const res = await fetch(`${apiUrl}/${resource}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    const data = await res.json();
    return { data: normalizeData(data, id, resource) };
  },

  // 📌 Get Many
  getMany: async (resource, params) => {
    // Handle non-existent resources
    if (resource === "s" || resource === "doctors") {
      return {
        data: params.ids.map(id => ({ id: getId(id), dummy: true }))
      };
    }

    const responses = await Promise.all(
      params.ids.map((id) =>
        fetch(`${apiUrl}/${resource}/${getId(id)}`).then((res) => res.json())
      )
    );
    return {
      data: responses.map((d, i) =>
        normalizeData(d, getId(params.ids[i]), resource)
      ),
    };
  },

  // 📌 Get Many Reference
  getManyReference: async (resource, params) => {
    // Handle non-existent resources
    if (resource === "s" || resource === "doctors") {
      return { data: [], total: 0 };
    }
    
    // For other resources, try to implement basic many reference
    try {
      const res = await fetch(`${apiUrl}/${resource}`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const json = await res.json();
      
      const dataArray = Array.isArray(json) ? json : [json];
      const filteredData = dataArray.filter((item: any) => 
        item[params.target] === params.id
      );
      
      return {
        data: filteredData.map((item: any) => normalizeData(item, null, resource)),
        total: filteredData.length,
      };
    } catch (error) {
      return { data: [], total: 0 };
    }
  },
  
  // 📌 Create
  create: async (resource, params) => {
    // Handle non-existent resources
    if (resource === "s" || resource === "doctors") {
      return { data: { id: 'dummy-id', ...params.data } };
    }
    
    const res = await fetch(`${apiUrl}/${resource}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params.data),
    });
    
    if (!res.ok) throw new Error(`Error ${res.status}`);
    const data = await res.json();
    return { data: normalizeData(data, null, resource) };
  },
};

export default dataProvider;