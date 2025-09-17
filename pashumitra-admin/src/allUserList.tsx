import React from "react";
import { useDataProvider, Loading, Error } from "react-admin";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function AllUsersPage() {
  const dataProvider = useDataProvider();
  const [doctors, setDoctors] = React.useState<any[]>([]);
  const [farmers, setFarmers] = React.useState<any[]>([]);
  const [stores, setStores] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await dataProvider.delete("users", { id });
        // Remove deleted user from UI
        setDoctors((prev) => prev.filter((u) => u.id !== id));
        setFarmers((prev) => prev.filter((u) => u.id !== id));
        setStores((prev) => prev.filter((u) => u.id !== id));
      } catch (err: any) {
        alert("Delete failed: " + err.message);
      }
    }
  };

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await dataProvider.getList("users", { pagination: { page: 1, perPage: 1000 }, sort: { field: "createdAt", order: "ASC" } });
        setDoctors(data.filter((u: any) => u.role === "Doctor"));
        setFarmers(data.filter((u: any) => u.role === "Farmer"));
        setStores(data.filter((u: any) => u.role === "MedicalStore"));
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [dataProvider]);

  if (loading) return <Loading />;
  if (error) return <Error>{error}</Error>;

  const renderTable = (title: string, records: any[], columns: { label: string; render: (row: any) => any }[]) => (
    <div style={{ marginBottom: "2rem" }}>
      <h2>{title}</h2>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((col, idx) => (
                <TableCell key={idx}>{col.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((row, idx) => (
              <TableRow key={idx}>
                {columns.map((col, cidx) => (
                  <TableCell key={cidx}>{col.render(row)}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );

  return (
    <div style={{ padding: "1rem" }}>
      {renderTable("Doctors", doctors, [
        { label: "Email", render: (r) => r.email },
        { label: "Phone", render: (r) => r.phone },
        { label: "Full Name", render: (r) => r.doctorProfile?.fullName || "N/A" },
        { label: "Specialization", render: (r) => r.doctorProfile?.specialization || "N/A" },
        { label: "Hospital", render: (r) => r.doctorProfile?.hospitalname || "N/A" },
        { label: "Experience", render: (r) => r.doctorProfile?.experience || "N/A" },
        { label: "City", render: (r) => r.doctorProfile?.city || "N/A" },
        { label: "State", render: (r) => r.doctorProfile?.state || "N/A" },
        { label: "Fee", render: (r) => r.doctorProfile?.fee || "N/A" },
        {
          label: "Actions", render: (r: any) => (
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => handleDelete(r.id)}
            >
              Delete
            </Button>
          )
        },

      ])}

      {renderTable("Farmers", farmers, [
        { label: "Email", render: (r) => r.email },
        { label: "Phone", render: (r) => r.phone },
        { label: "Full Name", render: (r) => r.farmerProfile?.fullName || "N/A" },
        { label: "Address", render: (r) => r.farmerProfile?.address || "N/A" },
        { label: "Village", render: (r) => r.farmerProfile?.village || "N/A" },
        { label: "City", render: (r) => r.farmerProfile?.city || "N/A" },
        { label: "State", render: (r) => r.farmerProfile?.state || "N/A" },
        { label: "Pincode", render: (r) => r.farmerProfile?.pincode || "N/A" },
        {
          label: "Actions", render: (r: any) => (
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => handleDelete(r.id)}
            >
              Delete
            </Button>
          )
        },

      ])}

      {renderTable("Medical Stores", stores, [
        { label: "Email", render: (r) => r.email },
        { label: "Phone", render: (r) => r.phone },
        { label: "Store Name", render: (r) => r.storeProfile?.storeName || "N/A" },
        { label: "Owner Name", render: (r) => r.storeProfile?.ownerName || "N/A" },
        { label: "Specialization", render: (r) => r.storeProfile?.specialization || "N/A" },
        { label: "Established", render: (r) => r.storeProfile?.established ? new Date(r.storeProfile.established).toLocaleDateString() : "N/A" },
        { label: "Address", render: (r) => r.storeProfile?.address || "N/A" },
        { label: "City", render: (r) => r.storeProfile?.city || "N/A" },
        { label: "State", render: (r) => r.storeProfile?.state || "N/A" },
        { label: "Pincode", render: (r) => r.storeProfile?.pincode || "N/A" },
        {
          label: "Actions", render: (r: any) => (
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => handleDelete(r.id)}
            >
              Delete
            </Button>
          )
        },
      ])}
    </div>
  );
}
